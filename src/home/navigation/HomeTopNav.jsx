import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Gem, User, LogOut, Calendar, Trophy, Bell, Play, ShoppingBag, MessageSquare, Home } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../../stores/useNotificationStore";

const NavIcon = ({
  onClick,
  title,
  icon,
  className = "",
  badge = null,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-400 transition-all duration-200 hover:border-slate-500/35 hover:bg-slate-800/55 hover:text-slate-100 ${className}`}
  >
    <span className="inline-flex items-center justify-center">{icon}</span>
    {badge}
  </button>
);

const HomeTopNav = ({
  user,
  levels,
  handleLogout,
  setChatOpen,
  isChatOpen,
  setCheckInOpen,
  setLeaderboardOpen,
  setNotificationOpen,
  hasUnclaimedReward,
}) => {
  const navigate = useNavigate();
  const userId = user?.id;
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const prevUnreadCountRef = useRef(0);

  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (
      unreadCount > prevUnreadCountRef.current &&
      prevUnreadCountRef.current > 0
    ) {
      const triggerTimeout = setTimeout(() => setHasNewNotification(true), 10);
      const resetTimeout = setTimeout(() => setHasNewNotification(false), 3000);
      return () => {
        clearTimeout(triggerTimeout);
        clearTimeout(resetTimeout);
      };
    }
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);


  const normalLevels = (levels || [])
    .filter((l) => l.slug !== "certificate" && l.type !== "CERTIFICATE")
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const isLevelCompleted = (level) =>
    level?.completed === true || level?.status === "COMPLETED";

  const isLevelUnlocked = (level) => {
    if (level?.unlocked === true) return true;
    return level?.status === "UNLOCKED" || level?.status === "COMPLETED";
  };

  const activeLevel = normalLevels.find(
    (level) => isLevelUnlocked(level) && !isLevelCompleted(level),
  );
  const latestUnlockedLevel = [...normalLevels]
    .reverse()
    .find((level) => isLevelUnlocked(level));
  const currentLevel = activeLevel || latestUnlockedLevel || normalLevels[0];
  const xp = user?.profile?.xp || 0;

  // completionPercent removed to fix lint error as it's currently unused in mobile-first nav



  return (
    <>
      {/* TOP NAV */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <Motion.nav
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="app-top-nav pointer-events-auto flex h-14 w-full items-center justify-between gap-3 px-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-6"
        >
          <div className="flex items-center justify-start gap-1 sm:gap-1.5 flex-1">
            {user ? (
              <>
                {/* Notification Bell — mobile only */}
                <button
                  type="button"
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-500/25 bg-slate-900/65 text-slate-400 sm:hidden"
                >
                  <Bell size={18} className={unreadCount > 0 ? "text-amber-300" : ""} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-300 ring-2 ring-slate-950" />
                  )}
                </button>

                {/* XP / Purchase — desktop & mobile */}
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  title="Buy XP"
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-2.5 transition-colors hover:bg-cyan-400/16"
                >
                  <Gem size={13} className="text-cyan-300" />
                  <span className="text-white font-bold text-xs">{xp.toLocaleString()}</span>
                </button>

                {/* Daily Check-in & Store — desktop only (moved from right) */}
                <div className="hidden sm:flex items-center gap-1">
                  <NavIcon
                    onClick={() => setCheckInOpen(true)}
                    title="Daily Check-in"
                    icon={<Calendar size={16} />}
                    badge={
                      hasUnclaimedReward ? (
                        <span className="pointer-events-none absolute -right-0.5 -top-0.5 z-10 h-2 w-2 animate-pulse rounded-full bg-amber-300 ring-2 ring-slate-950" />
                      ) : null
                    }
                  />

                  <NavIcon
                    onClick={() => navigate("/store")}
                    title="Store"
                    icon={<ShoppingBag size={16} />}
                  />
                </div>
              </>
            ) : null}
          </div>

          {/* CENTER: Title */}
          <div className="flex items-center justify-center shrink-0">
            <h1 className="app-title truncate px-2 text-center text-[0.7rem] font-semibold text-slate-100 sm:text-xs lg:text-sm">
              CLASH OF CODE
            </h1>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center justify-end gap-1.5 flex-1">
            {user ? (
              <>
                {/* Chat — mobile only */}
                <button
                  type="button"
                  onClick={() => setChatOpen((prev) => !prev)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-lg border transition-colors sm:hidden ${isChatOpen
                      ? "border-cyan-300/35 bg-cyan-400/15 text-cyan-300"
                      : "border-slate-500/25 bg-slate-900/65 text-slate-400"
                    }`}
                >
                  <MessageSquare size={18} strokeWidth={isChatOpen ? 2.5 : 1.75} />
                </button>

                {/* DESKTOP NAV ICONS — hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1">
                  <NavIcon
                    onClick={() => setChatOpen((prev) => !prev)}
                    title="Chat"
                    icon={<MessageSquare size={16} />}
                    className={isChatOpen ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-300" : ""}
                  />

                  <NavIcon
                    onClick={() => setLeaderboardOpen((prev) => !prev)}
                    title="Leaderboard"
                    icon={<Trophy size={16} />}
                  />

                  <NavIcon
                    onClick={() => {
                      if (Notification.permission === "default") {
                        useNotificationStore.getState().requestPermission();
                      }
                      setNotificationOpen((prev) => !prev);
                    }}
                    title="Notifications"
                    icon={
                      <Motion.div
                        animate={
                          hasNewNotification
                            ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <Bell size={16} className={unreadCount > 0 ? "text-amber-300" : ""} />
                      </Motion.div>
                    }
                    className={unreadCount > 0 ? "text-amber-300" : ""}
                    badge={
                      unreadCount > 0 ? (
                        <AnimatePresence>
                          <Motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="pointer-events-none absolute -right-0.5 -top-0.5 z-10 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-slate-950"
                          />
                        </AnimatePresence>
                      ) : null
                    }
                  />

                  <div className="mx-1 h-5 w-px bg-slate-500/35" />

                  {/* Profile */}
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    title="Profile"
                    className="h-8 w-8 rounded-lg overflow-hidden border border-slate-500/35 hover:border-slate-200/55 transition-all shrink-0 bg-slate-900/55"
                  >
                    {user?.profile?.avatar_url ? (
                      <img
                        src={user.profile.avatar_url}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800/65">
                        <User size={14} className="text-slate-400" />
                      </div>
                    )}
                  </button>

                  <NavIcon
                    onClick={handleLogout}
                    title="Logout"
                    icon={<LogOut size={14} />}
                    className="text-slate-500 hover:text-rose-300"
                  />

                  <div className="mx-1 h-5 w-px bg-slate-500/35" />
                </div>

                {/* Play CTA — hidden on mobile */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentLevel?.slug) {
                      navigate(`/level/${currentLevel.slug}`);
                    }
                  }}
                  title="Play"
                  className="hidden h-8 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300/35 bg-emerald-400/18 px-3 text-xs font-semibold tracking-wide text-emerald-50 transition-all duration-200 hover:bg-emerald-400/26 sm:inline-flex"
                >
                  <Play size={12} fill="currentColor" />
                  Play
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="h-8 rounded-lg border border-slate-500/25 bg-slate-900/50 px-3 text-xs font-medium text-slate-300 transition-colors hover:border-slate-300/40 hover:text-white"
              >
                Log in
              </button>
            )}
          </div>
        </Motion.nav>
      </div>

      {/* MOBILE BOTTOM NAV — Instagram style */}
      {user && (
        <Motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
        >
          {/* Top border line */}
          <div className="absolute left-0 right-0 top-0 h-px bg-slate-400/20" />
          <div className="app-top-nav px-2 pb-safe">
            <div className="flex items-center justify-around h-16">

              {/* Home */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-800/55 hover:text-slate-300"
                title="Home"
              >
                <Home size={24} strokeWidth={1.75} />
              </button>

              {/* Leaderboard */}
              <button
                type="button"
                onClick={() => setLeaderboardOpen((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-800/55 hover:text-slate-300"
                title="Ranks"
              >
                <Trophy size={24} strokeWidth={1.75} />
              </button>

              {/* Play — center button (now normal like others) */}
              <button
                type="button"
                onClick={() => {
                  if (currentLevel?.slug) navigate(`/level/${currentLevel.slug}`);
                }}
                className="flex h-12 w-12 flex-col items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-400/12 hover:text-emerald-300"
                title="Play"
              >
                <Play size={24} fill="none" strokeWidth={1.75} />
              </button>

              {/* Store */}
              <button
                type="button"
                onClick={() => navigate("/store")}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-800/55 hover:text-slate-300"
                title="Store"
              >
                <ShoppingBag size={24} strokeWidth={1.75} />
              </button>

              {/* Profile */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-800/55 hover:text-slate-300"
                title="Profile"
              >
                {user?.profile?.avatar_url ? (
                  <img src={user.profile.avatar_url} alt="profile" className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200/30" />
                ) : (
                  <User size={24} strokeWidth={1.75} />
                )}
              </button>

            </div>
          </div>
        </Motion.nav>
      )}
    </>
  );
};

export default HomeTopNav;
