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
  ArrowLeft
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { achievementsApi } from "../services/achievementsApi";
import useAuthStore from "../stores/useAuthStore";
import { 
  SkeletonPage, 
  SkeletonCard, 
  SkeletonText, 
  SkeletonCircle 
} from "../common/SkeletonPrimitives";

const AchievementsSkeleton = () => (
  <SkeletonPage className="bg-black p-4 sm:p-8">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <SkeletonCircle className="w-10 h-10" />
        <SkeletonText width="200px" height="1.5rem" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonText
            key={i}
            width="100px"
            height="2.5rem"
            className="rounded-lg shrink-0"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonCard key={i} className="h-48" variant="solid" />
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
    <div className="min-h-screen bg-black text-white selection:bg-white/10 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Minimal Breadcrumb/Header */}
        <div className="py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              <ArrowLeft size={18} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="ds-card p-4 flex items-center justify-between gap-5 bg-black border-white/20 shadow-sm group hover:border-white/40 transition-all">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center shrink-0 text-white group-hover:bg-white/10 transition-colors">
                <CheckCircle2 size={20} strokeWidth={2} />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="ds-eyebrow mb-1">Collection</p>
                <p className="text-sm font-semibold leading-snug text-white">
                  Completed Achievements
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">
                {userAchievements?.length || 0}{" "}
                <span className="text-xs text-white/40">/ {achievements?.length || 0}</span>
              </p>
            </div>
          </div>

          <div className="ds-card p-4 flex items-center justify-between gap-5 bg-black border-white/20 shadow-sm group hover:border-white/40 transition-all">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center shrink-0 text-white group-hover:bg-white/10 transition-colors">
                <Zap size={20} strokeWidth={2} />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="ds-eyebrow mb-1">Impact</p>
                <p className="text-sm font-semibold leading-snug text-white">
                  Total Points Earned
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-bold">
                {(userAchievements?.length || 0) * 10}{" "}
                <span className="text-[10px] text-white/40 uppercase tracking-widest">XP</span>
              </p>
            </div>
          </div>
        </div>

        {/* Category Switches */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border font-mono whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "text-white/50 border-white/10 bg-black hover:text-white hover:border-white/30 hover:bg-white/5"
                  }
                `}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
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
                    relative h-full flex flex-col p-5 rounded-2xl border transition-all duration-300 group
                    ${
                      unlocked
                        ? "bg-[#0a0a0a] border-white/10 hover:border-white/30 shadow-sm"
                        : "bg-black/40 border-white/5 opacity-60 grayscale"
                    }
                  `}
                  >
                    {/* Icon & Unlocked state */}
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className={`
                        w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500
                        ${
                          unlocked
                            ? "bg-white/10 border-white/20 text-white group-hover:bg-white group-hover:text-black group-hover:scale-105 shadow-premium"
                            : "bg-black border-white/5 text-white/20"
                        }
                      `}
                      >
                        <Trophy size={22} strokeWidth={unlocked ? 2 : 1.5} />
                      </div>

                      <div className="shrink-0 pt-1">
                        {unlocked ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          </div>
                        ) : (
                          <Lock size={12} className="text-white/20" />
                        )}
                      </div>
                    </div>

                    {/* Metadata Headlines */}
                    <div className="space-y-1 mb-6 flex-1">
                      <p className="ds-eyebrow group-hover:text-white/80 transition-colors">
                        {achievement.category}
                      </p>
                      <h3
                        className={`text-[15px] font-bold tracking-tight ${unlocked ? "text-white" : "text-white/40"}`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-[12px] leading-relaxed line-clamp-2 ${unlocked ? "text-white/60" : "text-white/20"}`}
                      >
                        {achievement.description}
                      </p>
                    </div>

                    {/* Footer / Reward */}
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.05]">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-white/5 border border-white/10">
                          <Zap size={10} className={unlocked ? "text-amber-400" : "text-white/20"} />
                        </div>
                        <span
                          className={`text-[11px] font-mono font-bold ${unlocked ? "text-white/90" : "text-white/20"}`}
                        >
                          {achievement.xp_reward} XP
                        </span>
                      </div>

                      {unlocked && (
                        <Motion.span
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Reached
                        </Motion.span>
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

