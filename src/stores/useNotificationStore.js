import { create } from "zustand";
import { notificationsAPI } from "../services/api";
import { notify } from "../services/notification";


/**
 * Centralized notification management.
 * Shared between NotificationDrawer and NotificationDropdown
 * for consistent state and unread count.
 */
const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  fcmToken: null,
  permission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
  _listenerSetup: false,

  /**
   * Initialize FCM notifications.
   */
  initFCM: async () => {
    if (typeof Notification === 'undefined') {
        console.warn("Notifications are not supported in this browser.");
        return;
    }
    
    console.log("Initializing FCM... Current permission:", Notification.permission);
    if (Notification.permission === "granted") {
        await get().registerFCM();
    }

    // Listen for foreground messages (only once)
    if (get()._listenerSetup) return;
    set({ _listenerSetup: true });
    try {
        const { onMessageListener } = await import("../services/firebase");
        onMessageListener((payload) => {
            console.log("Foreground message received (FULL):", JSON.stringify(payload, null, 2));
            
            // Show toast notification - try accessing data if notification is missing
            const title = payload.notification?.title || payload.data?.title || "New Notification";
            const body = payload.notification?.body || payload.data?.body || "You have a new message.";

            // Only show if we have some content
            if (payload.notification || payload.data) {
                notify.info(title, {
                    description: body,
                    duration: 5000,
                });
            }

            // Always refetch to update the red dot/count
            get().fetchNotifications(true);
        });


    } catch (error) {

        console.error("Error setting up foreground message listener:", error);
    }
  },

  /**
   * Request notification permission and register token.
   */
  requestPermission: async () => {
    if (typeof Notification === 'undefined') return 'default';
    
    console.log("Requesting notification permission...");
    try {
        const permission = await Notification.requestPermission();
        console.log("Permission result:", permission);
        set({ permission });
        if (permission === 'granted') {
            await get().registerFCM();
        }
        return permission;
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return 'default';
    }
  },

  /**
   * Register FCM token with backend.
   */
  registerFCM: async () => {
    console.log("[FCM] registration process started...");
    try {
        const { requestForToken } = await import("../services/firebase");
        const token = await requestForToken();
        
        if (!token) {
            console.warn("[FCM] No token received from Firebase. Registration aborted.");
            return;
        }

        console.log("[FCM] Token received from Firebase. Current stored token:", get().fcmToken ? "Present" : "None");
        
        if (token !== get().fcmToken) {
            console.log("[FCM] Syncing new token with backend...");
            const response = await notificationsAPI.registerFCMToken({
                token: token,
                device_id: navigator.userAgent
            });
            console.log("[FCM] Backend response status:", response.status);
            
            set({ fcmToken: token });
            console.log("[FCM] Token successfully synced with backend.");
            notify.success("Push notifications active! 🔔");
        } else {
            console.log("[FCM] Token is already synced with backend.");
        }
    } catch (error) {
        console.error("[FCM] Registration error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        notify.error("Failed to enable real-time notifications.");
    }
  },





  // Cache duration (2 minutes for real-time feel)
  CACHE_DURATION: 2 * 60 * 1000,

  /**
   * Fetch all notifications with caching.
   */
  fetchNotifications: async (force = false) => {
    const state = get();
    const now = Date.now();

    // Use cache if valid
    if (
      !force &&
      state.lastFetched &&
      now - state.lastFetched < state.CACHE_DURATION &&
      state.notifications.length > 0
    ) {
      return state.notifications;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await notificationsAPI.getNotifications();
      const notifications = response.data;

      // Calculate unread count
      const unreadCount = notifications.filter((n) => !n.is_read).length;

      set({
        notifications,
        unreadCount,
        isLoading: false,
        lastFetched: now,
        error: null,
      });

      return notifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to load notifications",
      });
      return [];
    }
  },

  /**
   * Mark a notification as read.
   */
  markAsRead: async (notificationId) => {
    try {
      await notificationsAPI.markRead(notificationId);

      // Update local state
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        );
        const unreadCount = updatedNotifications.filter((n) => !n.is_read).length;

        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllRead();

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));

      return { success: true };
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Clear all notifications.
   */
  clearAll: async () => {
    try {
      await notificationsAPI.clearAll();

      set({
        notifications: [],
        unreadCount: 0,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Add a new notification (for real-time updates).
   */
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  /**
   * Clear error state.
   */
  clearError: () => set({ error: null }),

  /**
   * Clear cache and reset state.
   */
  clearCache: () => {
    set({
      notifications: [],
      unreadCount: 0,
      lastFetched: null,
      error: null,
    });
  },
}));

export default useNotificationStore;
