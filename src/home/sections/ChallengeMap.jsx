import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Lock,
  BarChart3,
  Target,
  Sparkles,
} from "lucide-react";
import LevelButton from "../../game/LevelButton";
import { getTrackMeta } from "../../utils/challengeMeta";

const TRACK_ORDER = [
  "Python Basics",
  "Data Structures",
  "Control Flow",
  "Functions & Patterns",
  "Standard Library",
  "OOP Mastery",
];

const ChallengeMap = ({ levels, handleLevelClick, user }) => {
  const navigate = useNavigate();

  const {
    challengeLevels,
    certificateLevel,
    solvedCount,
    unlockedCount,
    grouped,
    totalStars,
    maxStars,
    trackProgress,
    completionPercent,
  } = useMemo(() => {
    const sorted = [...levels].sort((a, b) => (a.order || 0) - (b.order || 0));
    const cert =
      sorted.find((l) => l.slug === "certificate" || l.type === "CERTIFICATE") || null;
    const normal = sorted.filter(
      (l) => l.slug !== "certificate" && l.type !== "CERTIFICATE"
    );

    const groupsMap = {};
    normal.forEach((level) => {
      const track = getTrackMeta(level.order).label;
      if (!groupsMap[track]) groupsMap[track] = [];
      groupsMap[track].push(level);
    });

    const stars = normal.reduce((sum, level) => sum + (level.stars || 0), 0);
    const progress = {};

    Object.entries(groupsMap).forEach(([trackName, trackLevels]) => {
      const solved = trackLevels.filter((l) => l.completed).length;
      progress[trackName] = {
        solved,
        total: trackLevels.length,
        percent: trackLevels.length
          ? Math.round((solved / trackLevels.length) * 100)
          : 0,
      };
    });

    const completion = normal.length
      ? Math.round((normal.filter((l) => l.completed).length / normal.length) * 100)
      : 0;

    return {
      challengeLevels: normal,
      certificateLevel: cert,
      solvedCount: normal.filter((l) => l.completed).length,
      unlockedCount: normal.filter((l) => l.unlocked).length,
      grouped: groupsMap,
      totalStars: stars,
      maxStars: normal.length * 3,
      trackProgress: progress,
      completionPercent: completion,
    };
  }, [levels]);

  const statsCards = [
    {
      key: "solved",
      label: "Solved",
      icon: CheckCircle2,
      value: solvedCount,
      suffix: `/${challengeLevels.length}`,
      helper: "Challenges cleared",
    },
    {
      key: "unlocked",
      label: "Unlocked",
      icon: Lock,
      value: unlockedCount,
      suffix: `/${challengeLevels.length}`,
      helper: "Ready to play",
    },
    {
      key: "star-score",
      label: "Star Score",
      icon: Target,
      value: totalStars,
      suffix: `/${maxStars}`,
      helper: "Total stars earned",
    },
    {
      key: "completed",
      label: "Completed",
      icon: BarChart3,
      value: completionPercent,
      suffix: "%",
      helper: "Overall progress",
    },
  ];

  return (
    <div
      className="w-full h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {!user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="pointer-events-auto max-w-2xl"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-[#2a3648] bg-[#121b2a]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-5">
              <Sparkles size={12} className="text-[#60a5fa]" />
              Professional Python Track
            </p>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Welcome to
              <span className="block text-[#60a5fa]">Clash of Code</span>
            </h1>
            <p className="text-slate-300 text-base mt-5 mb-10 max-w-xl mx-auto leading-relaxed">
              Structured challenge roadmap with verified progression, clean code
              practice, and milestone-based learning.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="h-12 px-8 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-sm tracking-wide transition-colors"
            >
              Login To Start Solving
            </button>
          </motion.div>
        </div>
      )}

      <div
        className={`w-full h-[calc(100vh-64px)] mt-16 px-3 sm:px-5 lg:px-6 pt-3 pb-0 transition-all duration-700 ${
          !user ? "blur-sm opacity-25 grayscale pointer-events-none select-none" : ""
        }`}
      >
        <div className="h-full overflow-y-auto pr-1 pb-5 space-y-4 custom-scrollbar">
          <section className="w-full rounded-3xl border border-white/14 bg-linear-to-br from-white/[0.14] via-white/[0.08] to-white/[0.03] backdrop-blur-xl p-3 sm:p-4 shadow-[0_24px_65px_rgba(0,0,0,0.34)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {statsCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.key}
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#101a29]/65 p-4 backdrop-blur-md"
                  >
                    <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/8 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-8 w-8 rounded-lg border border-white/20 bg-white/[0.04] inline-flex items-center justify-center text-slate-300"
                        >
                          <Icon size={15} />
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-white/85">
                          {card.label}
                        </span>
                      </div>
                      <div className="mt-2.5 flex items-end gap-1.5">
                        <span className="text-4xl font-black text-white leading-none">
                          {card.value}
                        </span>
                        <span className="text-[1.38rem] font-bold text-white/42 leading-none">
                          {card.suffix}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-white/65">{card.helper}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {TRACK_ORDER.map((track) => {
            const trackLevels = grouped[track] || [];
            if (!trackLevels.length) return null;

            return (
              <section key={track} className="w-full rounded-2xl border border-white/12 bg-[#0f1827]/64 backdrop-blur-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">{track}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {trackProgress[track]?.solved || 0}/{trackLevels.length} solved
                    </p>
                  </div>
                  <div className="w-36">
                    <div className="h-2 rounded-full bg-[#1d2736] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#3b82f6] to-[#38bdf8]"
                        style={{ width: `${trackProgress[track]?.percent || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {trackLevels.map((level, index) => {
                    const next = trackLevels[index + 1];
                    const isCurrentLevel = level.unlocked && !next?.unlocked;

                    return (
                      <LevelButton
                        key={level.id}
                        level={level}
                        isCurrentLevel={isCurrentLevel}
                        onClick={() => handleLevelClick(level)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}

          {certificateLevel && (
            <section className="w-full rounded-2xl border border-white/12 bg-[#0f1827]/64 backdrop-blur-xl p-4 sm:p-5">
              <h3 className="text-sm font-bold text-[#f8d08b] uppercase tracking-[0.16em] mb-3">
                Certification
              </h3>
              <div className="max-w-xl">
                <LevelButton
                  level={certificateLevel}
                  isCurrentLevel={false}
                  onClick={() => handleLevelClick(certificateLevel)}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeMap;
