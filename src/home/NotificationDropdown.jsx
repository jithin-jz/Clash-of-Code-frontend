import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Bell, Check } from "lucide-react";
import { notificationsAPI } from "../services/api";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

const NotificationDropdown = ({ className }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Poll for notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all read", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      handleMarkRead(notification.id, { stopPropagation: () => {} });
    }

    // Navigate based on target logic (if we had it fully implemented)
    // For now, if it's a post (has image), maybe navigate to profile or show post?
    // Since we don't have a dedicated single-post URL yet (it's a modal on home/profile),
    // we might just navigate to the actor's profile for now.
    if (notification.actor?.username) {
      navigate(`/profile/${notification.actor.username}`);
    }
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) fetchNotifications();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative text-white hover:text-white hover:bg-transparent",
            className,
          )}
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 bg-[#121212]/95 backdrop-blur-xl border-zinc-800 p-0 text-white max-h-[400px] flex flex-col shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-right-5 duration-200"
      >
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900 z-10">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Mark read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        <div className="overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`
                                    flex items-start gap-3 p-3 cursor-pointer focus:bg-zinc-800
                                    ${!notification.is_read ? "bg-zinc-800/50" : ""}
                                `}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Actor Avatar */}
                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden shrink-0">
                  {notification.actor?.avatar_url ? (
                    <img
                      src={notification.actor.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white/50">
                      {notification.actor?.username?.[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {notification.actor?.username}
                    </span>{" "}
                    <span className="text-zinc-300">{notification.verb}</span>
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                {/* Target Preview (e.g., Post Image) */}
                {notification.target_preview && (
                  <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden shrink-0">
                    <img
                      src={notification.target_preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Unread Indicator / Mark Read Action */}
                {!notification.is_read && (
                  <div className="self-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
