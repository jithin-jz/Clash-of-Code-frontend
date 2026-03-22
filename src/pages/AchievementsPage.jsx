import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Users,
  Medal,
  TrendingUp,
  Zap,
  Lock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { achievementsApi } from "../services/achievementsApi";
import useAuthStore from "../stores/useAuthStore";
import {
  SkeletonPage,
  SkeletonCard,
  SkeletonText,
  SkeletonCircle,
  SkeletonBase,
} from "../common/SkeletonPrimitives";

const AchievementsSkeleton = () => (
  <SkeletonPage className="p-4 sm:p-8 relative overflow-hidden">
    <div className="max-w-[1200px] mx-auto space-y-10 relative z-10">
      <div className="flex justify-between items-center py-6">
        <div className="flex gap-4 items-center">
          <SkeletonBase className="w-11 h-11 rounded-xl" />
          <div className="space-y-2">
            <SkeletonText
              width="80px"
              height="0.65rem"
              className="opacity-30"
            />
            <SkeletonText width="220px" height="1.75rem" />
          </div>
        </div>
        <div className="hidden sm:block text-right space-y-2">
          <SkeletonText
            width="70px"
            height="0.65rem"
            className="opacity-30 ml-auto"
          />
          <SkeletonText width="40px" height="1.25rem" className="ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <SkeletonBase key={i} className="h-24 rounded-[1.5rem]" />
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBase key={i} className="h-10 w-28 rounded-xl shrink-0" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} className="h-56" variant="solid" />
        ))}
      </div>
    </div>
  </SkeletonPage>
);

const CATEGORIES = [
  { id: "all", label: "All Hall", icon: Trophy },
  { id: "CODING", label: "Coding", icon: Target },
  { id: "COMMUNITY", label: "Community", icon: Users },
  { id: "CONSISTENCY", label: "Consistency", icon: TrendingUp },
  { id: "SPECIAL", label: "Special", icon: Medal },
];

const AchievementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [allRes, userRes] = await Promise.all([
          achievementsApi.getAllAchievements(),
          achievementsApi.getUserAchievements(user.username),
        ]);
        setAchievements(allRes || []);
        setUserAchievements(userRes || []);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setTimeout(() => setLoading(false), 500); // Small smooth delay
      }
    };
    fetchData();
  }, [user]);

  const filteredAchievements = useMemo(() => {
    if (activeTab === "all") return achievements;
    return achievements.filter((a) => a.category === activeTab);
  }, [achievements, activeTab]);

  const isUnlocked = (achievementId) => {
    return userAchievements.some((ua) => ua.achievement.id === achievementId);
  };

  if (loading) return <AchievementsSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 pb-24 relative overflow-hidden">
      {/* Vivid Background FX */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Ambient Shadows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,10,10,0.4),#000)]" />

        {/* Colorful Glow Orbs */}
        <div
          className="absolute top-[5%] right-[-5%] w-[450px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full animate-pulse opacity-40"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse opacity-30"
          style={{ animationDuration: "14s" }}
        />
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-amber-500/5 blur-[90px] rounded-full opacity-20" />

        {/* Subtle Scanlines / Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Minimal Breadcrumb/Header */}
        <div className="py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group relative w-11 h-11 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <ArrowLeft
                size={18}
                className="relative z-10 group-hover:-translate-x-0.5 transition-transform"
              />
            </button>
            <div>
              <p className="ds-eyebrow mb-0.5">Hall of Fame</p>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase sm:text-2xl">
                Achievements
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="ds-eyebrow">Trophy Score</p>
              <p className="text-lg font-mono font-bold leading-none">
                {(userAchievements?.length || 0) * 10}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary - Styled like Platform Status card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="group relative p-5 flex items-center justify-between gap-5 bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-all hover:border-emerald-500/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-4 min-w-0 relative z-10">
              <div className="w-11 h-11 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2
                  size={22}
                  strokeWidth={2.5}
                  className="drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 font-mono mb-1">
                  Collection
                </p>
                <p className="text-sm font-black leading-snug text-neutral-100 uppercase tracking-tight">
                  Honor Roll
                </p>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-3xl font-black font-mono tracking-tighter text-white">
                {userAchievements?.length || 0}
                <span className="text-xs text-neutral-600 ml-1">
                  /{achievements?.length || 0}
                </span>
              </p>
            </div>
          </div>

          <div className="group relative p-5 flex items-center justify-between gap-5 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden transition-all hover:border-purple-500/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-4 min-w-0 relative z-10">
              <div className="w-11 h-11 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center shrink-0 text-purple-400 group-hover:scale-110 transition-transform">
                <Zap
                  size={22}
                  strokeWidth={2.5}
                  className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500/60 font-mono mb-1">
                  Impact
                </p>
                <p className="text-sm font-black leading-snug text-neutral-100 uppercase tracking-tight">
                  Total Might
                </p>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-3xl font-black font-mono tracking-tighter text-white">
                {(userAchievements?.length || 0) * 10}
                <span className="text-[10px] text-neutral-600 ml-1 uppercase">
                  XP
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Category Switches */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`
                  group relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all border font-mono whitespace-nowrap overflow-hidden
                  ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)] scale-105 z-10"
                      : "text-white/40 border-white/5 bg-white/[0.02] hover:text-white hover:border-white/20 hover:bg-white/[0.05]"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 pointer-events-none" />
                )}
                <Icon
                  size={14}
                  strokeWidth={isActive ? 3 : 2}
                  className={isActive ? "text-emerald-600" : ""}
                />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, idx) => {
              const unlocked = isUnlocked(achievement.id);
              return (
                <Motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="h-full"
                >
                  <div
                    className={`
                    relative h-full flex flex-col p-6 rounded-[2rem] border transition-all duration-500 group overflow-hidden
                    ${
                      unlocked
                        ? "bg-white/[0.03] backdrop-blur-md border-white/10 hover:border-emerald-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                        : "bg-white/[0.01] border-white/10 opacity-100"
                    }
                  `}
                  >
                    {unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    )}
                    {/* Icon & Unlocked state */}
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div
                        className={`
                        w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-700 relative overflow-hidden
                        ${
                          unlocked
                            ? "bg-black/60 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                            : "bg-white/[0.02] border-white/10 text-white/10"
                        }
                      `}
                      >
                        {unlocked && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent animate-pulse" />
                        )}
                        <Trophy
                          size={26}
                          strokeWidth={unlocked ? 2.5 : 1.5}
                          className={
                            unlocked
                              ? "drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                              : ""
                          }
                        />
                      </div>

                      <div className="shrink-0 pt-1">
                        {unlocked ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Lock size={12} className="text-white/20" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Headlines */}
                    <div className="space-y-1.5 mb-8 flex-1 relative z-10">
                      <p
                        className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono transition-colors ${unlocked ? "text-emerald-500/60 group-hover:text-emerald-400" : "text-neutral-600"}`}
                      >
                        {achievement.category}
                      </p>
                      <h3
                        className={`text-base font-black tracking-tight font-mono ${unlocked ? "text-white" : "text-white/80"}`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-[12px] leading-relaxed line-clamp-2 font-medium ${unlocked ? "text-neutral-400 group-hover:text-neutral-300" : "text-white/40"}`}
                      >
                        {achievement.description}
                      </p>
                    </div>

                    {/* Footer / Reward */}
                    <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/[0.05] relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Zap
                            size={11}
                            className={
                              unlocked ? "text-emerald-400" : "text-white/10"
                            }
                          />
                        </div>
                        <span
                          className={`text-xs font-black font-mono tracking-tighter ${unlocked ? "text-emerald-50/90" : "text-white/10"}`}
                        >
                          {achievement.xp_reward}{" "}
                          <span className="text-[10px] opacity-40">XP</span>
                        </span>
                      </div>

                      {unlocked && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black font-mono text-emerald-500 uppercase tracking-[0.2em]">
                            Claimed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
