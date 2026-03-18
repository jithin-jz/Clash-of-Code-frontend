import React, { useState, useEffect } from "react";
import { Trophy, Lock } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const ICON_MAP = {
  Zap: "⚡",
  TrendingUp: "📈",
  Medal: "🏅",
  Crown: "👑",
  Flame: "🔥",
  Star: "⭐",
  Calendar: "📅",
  UserPlus: "👤",
  Users: "👥",
  Trophy: "🏆",
};

const CATEGORY_COLORS = {
  challenge: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  streak: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  social: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  special: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
};

const AchievementBadges = ({ username }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => {
    if (!username) return;
    const fetchAchievements = async () => {
      try {
        const res = await api.get(`/achievements/user/${username}/`);
        setAchievements(res.data);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [username]);

  if (loading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 text-xs">
        <Lock size={12} />
        <span>No achievements yet</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {achievements.map(({ achievement, unlocked_at }) => {
          const colors = CATEGORY_COLORS[achievement.category] || CATEGORY_COLORS.challenge;
          const emoji = ICON_MAP[achievement.icon] || "🏆";

          return (
            <Motion.button
              key={achievement.slug}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSelectedAchievement({ ...achievement, unlocked_at })
              }
              className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-lg transition-all hover:shadow-lg cursor-pointer`}
              title={achievement.title}
            >
              {emoji}
            </Motion.button>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAchievement(null)}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 max-w-xs w-full mx-4 text-center shadow-2xl"
            >
              <div className="text-5xl mb-4">
                {ICON_MAP[selectedAchievement.icon] || "🏆"}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {selectedAchievement.title}
              </h3>
              <p className="text-sm text-neutral-400 mb-4">
                {selectedAchievement.description}
              </p>
              {selectedAchievement.xp_reward > 0 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
                  +{selectedAchievement.xp_reward} XP
                </div>
              )}
              {selectedAchievement.unlocked_at && (
                <p className="text-[10px] text-neutral-600 font-mono">
                  Unlocked{" "}
                  {new Date(selectedAchievement.unlocked_at).toLocaleDateString()}
                </p>
              )}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementBadges;
