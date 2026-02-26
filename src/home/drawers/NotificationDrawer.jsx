import React, { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Trash2,
  X,
  MessageSquare,
  Gift,
  Heart,
  UserPlus,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { SkeletonBase } from "../../common/SkeletonPrimitives";
import useNotificationStore from "../../stores/useNotificationStore";
import useAuthStore from "../../stores/useAuthStore";

const NotificationDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotificationStore();

  useEffect(() => {
    if (!isOpen || !user) return;
    fetchNotifications(true);
  }, [isOpen, user, fetchNotifications]);

  const handleMarkRead = async (id, e) => {
    if (e) e.stopPropagation();
    await markAsRead(id);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      handleMarkRead(notification.id);
    }
    onClose();
    if (notification.actor?.username) {
      navigate(`/profile/${notification.actor.username}`);
    }
  };

  const getVerbConfig = (verb) => {
    const v = verb.toLowerCase();
    if (v.includes("follow")) return { icon: <UserPlus size={14} />, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" };
    if (v.includes("like")) return { icon: <Heart size={14} />, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" };
    if (v.includes("comment")) return { icon: <MessageSquare size={14} />, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" };
    if (v.includes("gift")) return { icon: <Gift size={14} />, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" };
    if (v.includes("verified")) return { icon: <Shield size={14} />, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" };
    return { icon: <Bell size={14} />, color: "text-slate-400", bg: "bg-white/10", border: "border-white/20" };
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
    return `${baseUrl}${url}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm sm:hidden"
          />
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full z-[60] w-full sm:w-[420px] bg-[#03070c] shadow-2xl flex flex-col border-l border-white/[0.08]"
          >
            {/* Header */}
            <header className="relative shrink-0 h-14 bg-[#0a0f18]/95 backdrop-blur-2xl flex items-center justify-between px-6 border-b border-white/[0.08]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                   <Bell size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest text-white uppercase font-sans">
                    Transmissions
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? "bg-accent animate-pulse shadow-[0_0_8px_rgba(255,161,22,0.6)]" : "bg-slate-600"}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {unreadCount} UNREAD
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                   <button
                    onClick={markAllAsRead}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
                    title="Acknowledge All"
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-transparent">
              {isLoading && notifications.length === 0 ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                    <Zap size={32} className="text-slate-600" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Signal Clear</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification, index) => {
                    const config = getVerbConfig(notification.verb);
                    return (
                      <Motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border cursor-pointer ${
                          !notification.is_read 
                            ? "bg-primary/5 border-primary/20 shadow-[0_4px_20px_rgba(0,175,155,0.05)]" 
                            : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]"
                        }`}
                      >
                        {/* Status Marker */}
                        {!notification.is_read && (
                          <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}

                        {/* Avatar & Icon Badge */}
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-white/[0.05]">
                            {getImageUrl(notification.actor?.avatar_url) ? (
                              <img
                                src={getImageUrl(notification.actor.avatar_url)}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-black bg-primary/10 text-primary uppercase">
                                {notification.actor?.username?.[0]}
                              </div>
                            )}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center border shadow-lg ${config.bg} ${config.border} ${config.color}`}>
                            {config.icon}
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-[13px] leading-relaxed text-slate-300">
                            <span className={`font-black uppercase tracking-tight ${!notification.is_read ? "text-white" : "text-slate-400"}`}>
                              {notification.actor?.username || "SYSTEM"}
                            </span>{" "}
                            <span className="font-medium text-slate-500">{notification.verb}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black font-mono text-slate-600 uppercase tracking-tighter">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        {/* Action Hint */}
                        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                           <ArrowRight size={14} className="text-primary" />
                        </div>
                      </Motion.div>
                    );
                  })}
                </div>
              )}
            </main>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <footer className="p-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all flex items-center gap-2"
                >
                  <Trash2 size={12} />
                  Purge History
                </button>
              </footer>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default memo(NotificationDrawer);
