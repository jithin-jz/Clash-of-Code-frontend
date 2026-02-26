import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gem, User, LogOut, Calendar, Trophy, Bell, Play, ShoppingBag, MessageSquare, Menu, X, Home } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../../stores/useNotificationStore";

const NavIcon = ({
  onClick,
  title,
  icon,
  className = "",
  badge = null,
  active = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`group relative h-9 w-9 rounded-xl transition-all duration-300 inline-flex items-center justify-center shrink-0 
      ${active
        ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,175,155,0.15)]"
        : "bg-transparent text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
      } ${className}`}
  >
    <span className="inline-flex items-center justify-center">{icon}</span>
    {badge}
    {active && (
      <Motion.div
        layoutId="active-dot"
        className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
      />
    )}
  </button>
);

const HomeTopNav = ({
  user,
  levels,
  handleLogout,
  setChatOpen,
  isChatOpen,
  setLeaderboardOpen,
  setNotificationOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = user?.id;
  const prevUnreadCountRef = useRef(0);

  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (userId) fetchNotifications();
  }, [userId, fetchNotifications]);

  useEffect(() => {
    prevUnreadCountRef.current = unreadCount;
  }, [unreadCount]);

  const normalLevels = (levels || [])
    .filter((l) => l.slug !== "certificate" && l.type !== "CERTIFICATE")
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const isLevelUnlocked = (level) => level?.status === "UNLOCKED" || level?.status === "COMPLETED";
  const isLevelCompleted = (level) => level?.status === "COMPLETED";

  const activeLevel = normalLevels.find(l => isLevelUnlocked(l) && !isLevelCompleted(l));
  const latestUnlocked = [...normalLevels].reverse().find(isLevelUnlocked);
  const currentLevel = activeLevel || latestUnlocked || normalLevels[0];
  const xp = user?.profile?.xp || 0;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <Motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto h-14 w-full border-b border-white/[0.06] bg-[#03070c]/80 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between gap-4"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Code2 size={18} className="text-primary" />
            </div>
            <h1 className="hidden sm:block text-sm font-black tracking-[0.2em] text-white uppercase font-sans">
              Clash<span className="text-primary">Of</span>Code
            </h1>
          </div>

          {/* Center: Main Nav (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.05]">
            <button
              onClick={() => navigate("/")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${isActive("/") ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/store")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${isActive("/store") ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
            >
              Marketplace
            </button>
            <button
              onClick={() => navigate("/shop")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${isActive("/shop") ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
            >
              Buy XP
            </button>
          </div>

          {/* Right Section: User & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* XP Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <Gem size={14} className="text-accent" />
                  <span className="text-xs font-black text-white">{xp.toLocaleString()}</span>
                </div>

                {/* Leaderboard Toggle */}
                <div className="hidden sm:block">
                  <NavIcon
                    onClick={() => setLeaderboardOpen(p => !p)}
                    icon={<Trophy size={18} />}
                  />
                </div>

                {/* Notifications */}
                <NavIcon
                  onClick={() => setNotificationOpen(p => !p)}
                  icon={<Bell size={18} className={unreadCount > 0 ? "text-accent" : ""} />}
                  badge={unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent ring-2 ring-[#03070c] animate-pulse" />
                  )}
                />

                {/* Chat Toggle */}
                <NavIcon
                  onClick={() => setChatOpen(p => !p)}
                  active={isChatOpen}
                  icon={<MessageSquare size={18} />}
                />

                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

                {/* Profile Toggle (Desktop) */}
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="h-9 w-9 rounded-xl overflow-hidden border-2 border-white/5 hover:border-primary/50 transition-all"
                  >
                    {user?.profile?.avatar_url ? (
                      <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-destructive transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all uppercase tracking-widest"
              >
                Sign In
              </button>
            )}
          </div>
        </Motion.nav>
      </div>

      {/* MOBILE BOTTOM NAV */}
      {user && (
        <Motion.nav
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 w-full"
        >
          <div className="flex items-center justify-around h-14 border-t border-white/10 bg-[#03070c]/95 backdrop-blur-3xl px-2">
            <MobileTab
              icon={<Home size={22} />}
              active={isActive("/")}
              onClick={() => navigate("/")}
            />
            <MobileTab
              icon={<Trophy size={22} />}
              active={isActive("/leaderboard")}
              onClick={() => setLeaderboardOpen(p => !p)}
            />
            <MobileTab
              icon={<Play size={22} className="ml-0.5" />}
              active={false}
              onClick={() => currentLevel?.slug && navigate(`/level/${currentLevel.slug}`)}
              className="bg-primary/10 text-primary rounded-2xl"
            />
            <MobileTab
              icon={<ShoppingBag size={22} />}
              active={isActive("/store")}
              onClick={() => navigate("/store")}
            />
            <MobileTab
              icon={user?.profile?.avatar_url ? (
                <img src={user.profile.avatar_url} className="w-6 h-6 rounded-full object-cover" alt="" />
              ) : (
                <User size={22} />
              )}
              active={isActive("/profile")}
              onClick={() => navigate("/profile")}
            />
          </div>
        </Motion.nav>
      )}
    </>
  );
};

const MobileTab = ({ icon, active, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${active ? "text-primary bg-primary/10" : "text-slate-400"} ${className}`}
  >
    {icon}
    {active && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />}
  </button>
);

function Code2({ size, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default HomeTopNav;
