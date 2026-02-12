import { create } from "zustand";

/**
 * Centralized UI state management for modals and drawers.
 * Single source of truth for all UI element visibility.
 */
const useUIStore = create((set) => ({
  // Drawer States
  isChatDrawerOpen: false,
  isLeaderboardDrawerOpen: false,
  isNotificationDrawerOpen: false,

  // Modal States
  isCertificateModalOpen: false,
  isCreatePostModalOpen: false,
  isCheckInModalOpen: false,
  activeModal: null, // Track which modal is currently active

  // Chat Drawer
  openChatDrawer: () =>
    set({
      isChatDrawerOpen: true,
      isLeaderboardDrawerOpen: false,
      isNotificationDrawerOpen: false,
    }),
  closeChatDrawer: () => set({ isChatDrawerOpen: false }),
  toggleChatDrawer: () =>
    set((state) => {
      const newState = !state.isChatDrawerOpen;
      return {
        isChatDrawerOpen: newState,
        // Close other drawers when opening chat
        isLeaderboardDrawerOpen: newState ? false : state.isLeaderboardDrawerOpen,
        isNotificationDrawerOpen: newState
          ? false
          : state.isNotificationDrawerOpen,
      };
    }),

  // Leaderboard Drawer
  openLeaderboardDrawer: () =>
    set({
      isLeaderboardDrawerOpen: true,
      isChatDrawerOpen: false,
      isNotificationDrawerOpen: false,
    }),
  closeLeaderboardDrawer: () => set({ isLeaderboardDrawerOpen: false }),
  toggleLeaderboardDrawer: () =>
    set((state) => {
      const newState = !state.isLeaderboardDrawerOpen;
      return {
        isLeaderboardDrawerOpen: newState,
        isChatDrawerOpen: newState ? false : state.isChatDrawerOpen,
        isNotificationDrawerOpen: newState
          ? false
          : state.isNotificationDrawerOpen,
      };
    }),

  // Notification Drawer
  openNotificationDrawer: () =>
    set({
      isNotificationDrawerOpen: true,
      isChatDrawerOpen: false,
      isLeaderboardDrawerOpen: false,
    }),
  closeNotificationDrawer: () => set({ isNotificationDrawerOpen: false }),
  toggleNotificationDrawer: () =>
    set((state) => {
      const newState = !state.isNotificationDrawerOpen;
      return {
        isNotificationDrawerOpen: newState,
        isChatDrawerOpen: newState ? false : state.isChatDrawerOpen,
        isLeaderboardDrawerOpen: newState ? false : state.isLeaderboardDrawerOpen,
      };
    }),

  // Close all drawers
  closeAllDrawers: () =>
    set({
      isChatDrawerOpen: false,
      isLeaderboardDrawerOpen: false,
      isNotificationDrawerOpen: false,
    }),

  // Certificate Modal
  openCertificateModal: () =>
    set({ isCertificateModalOpen: true, activeModal: "certificate" }),
  closeCertificateModal: () =>
    set({ isCertificateModalOpen: false, activeModal: null }),

  // Create Post Modal
  openCreatePostModal: () =>
    set({ isCreatePostModalOpen: true, activeModal: "createPost" }),
  closeCreatePostModal: () =>
    set({ isCreatePostModalOpen: false, activeModal: null }),

  // Check-In Modal
  openCheckInModal: () =>
    set({ isCheckInModalOpen: true, activeModal: "checkIn" }),
  closeCheckInModal: () =>
    set({ isCheckInModalOpen: false, activeModal: null }),

  // Generic modal control
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  // Close all modals
  closeAllModals: () =>
    set({
      isCertificateModalOpen: false,
      isCreatePostModalOpen: false,
      isCheckInModalOpen: false,
      activeModal: null,
    }),

  // Close everything (drawers + modals)
  closeAll: () =>
    set({
      isChatDrawerOpen: false,
      isLeaderboardDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isCertificateModalOpen: false,
      isCreatePostModalOpen: false,
      isCheckInModalOpen: false,
      activeModal: null,
    }),
}));

export default useUIStore;
