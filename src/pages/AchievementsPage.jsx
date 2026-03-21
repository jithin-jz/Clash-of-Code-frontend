import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, 
  Award, 
  Target, 
  Users, 
  Calendar, 
  Star, 
  ArrowLeft,
  ArrowRight,
  Medal,
  TrendingUp,
  Zap,
  Lock,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { achievementsApi } from "../services/achievementsApi";
import useAuthStore from "../stores/useAuthStore";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

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
          achievementsApi.getUserAchievements(user.username)
        ]);
        setAchievements(allRes || []);
        setUserAchievements(userRes || []);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredAchievements = useMemo(() => {
    if (activeTab === "all") return achievements;
    return achievements.filter(a => a.category === activeTab);
  }, [achievements, activeTab]);

  const isUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.achievement.id === achievementId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Trophy className="text-white/20 w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 pb-20 sm:pb-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 border-b border-[#1e1e1e] bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-[#1c1c1c] shrink-0"
          >
            <ArrowLeft size={16} />
          </Button>

          <div className="w-px h-4 bg-[#222]" />

          <h1 className="text-xs font-bold uppercase tracking-[0.2em] font-mono text-neutral-400">
            Achievements Hall
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Simple Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border font-mono whitespace-nowrap
                  ${isActive 
                    ? "bg-[#161616] text-white border-[#333] shadow-lg" 
                    : "text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-[#0d0d0d] hover:border-[#1a1a1a]"
                  }
                `}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Stats Summary - Very Minimal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex items-center justify-between group hover:border-[#333] transition-colors">
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Completed</p>
              <h3 className="text-xl font-mono">{userAchievements?.length || 0} / {achievements?.length || 0}</h3>
            </div>
            <CheckCircle2 className="text-neutral-800 group-hover:text-white transition-colors" size={24} />
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex items-center justify-between group hover:border-[#333] transition-colors">
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 font-mono">Trophy Score</p>
              <h3 className="text-xl font-mono">{(userAchievements?.length || 0) * 10}</h3>
            </div>
            <Zap className="text-neutral-800 group-hover:text-white transition-colors" size={24} />
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement) => {
              const unlocked = isUnlocked(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className={`
                    h-full bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden group transition-all duration-300
                    ${unlocked ? "hover:border-[#333]" : "opacity-60"}
                  `}>
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* Icon Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500
                          ${unlocked 
                            ? "bg-white/5 border-white/10 text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black" 
                            : "bg-black border-[#1a1a1a] text-neutral-700"}
                        `}>
                          <Trophy size={20} className={unlocked ? "" : "opacity-30"} />
                        </div>
                        
                        {!unlocked && <Lock size={14} className="text-neutral-800" />}
                        {unlocked && <Star size={14} className="text-white fill-white/20" />}
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h3 className={`text-[13px] font-bold tracking-tight ${unlocked ? "text-white" : "text-neutral-500"}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-[11px] text-neutral-600 leading-relaxed min-h-[32px]">
                          {achievement.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <Zap size={10} className={unlocked ? "text-white" : "text-neutral-800"} />
                          <span className={`text-[10px] font-mono font-bold ${unlocked ? "text-neutral-400" : "text-neutral-800"}`}>
                            {achievement.xp_reward} XP
                          </span>
                        </div>
                        
                        {unlocked && (
                          <span className="text-[9px] font-mono font-bold text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
