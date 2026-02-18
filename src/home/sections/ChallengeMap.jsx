import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Crown, Lock, Sparkles } from "lucide-react";
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
    certificateLevel,
    completedChallenges,
    totalChallenges,
    certificateProgressPercent,
    grouped,
    trackProgress,
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
    const completed = normal.filter((l) => l.completed).length;

    return {
      certificateLevel: cert,
      completedChallenges: completed,
      totalChallenges: normal.length,
      certificateProgressPercent: normal.length
        ? Math.round((completed / normal.length) * 100)
        : 0,
      grouped: groupsMap,
      trackProgress: progress,
    };
  }, [levels]);

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
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 mb-5">
              <Sparkles size={12} className="text-sky-300" />
              Structured Python Track
            </p>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Build Strong
              <span className="block text-[#93c5fd]">Python Skills</span>
            </h1>
            <p className="text-slate-300 text-base mt-5 mb-10 max-w-xl mx-auto leading-relaxed">
              Practice with focused coding challenges, track measurable progress,
              and reach certification with a clear learning path.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="h-12 px-8 rounded-xl border border-white/15 bg-white text-[#0f172a] hover:bg-slate-100 font-bold text-sm tracking-wide transition-colors"
            >
              Sign In to Continue
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
                        motionIndex={index}
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
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-sm font-black text-[#f8d08b] uppercase tracking-[0.16em]">
                    Certification
                  </h3>
                  <span className="inline-flex items-center rounded-full border border-[#f8d08b]/35 bg-[#f8d08b]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f8d08b]">
                    Final Milestone
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleLevelClick(certificateLevel)}
                  className={`w-full rounded-2xl border text-left p-4 sm:p-5 transition-all duration-300 ${
                    certificateLevel.unlocked
                      ? "cursor-pointer border-[#f8d08b]/45 bg-[#120e06]/68 hover:border-[#f8d08b]/70 hover:bg-[#161108]/82"
                      : "cursor-not-allowed border-[#6b5b38]/40 bg-[#120e06]/56"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="h-12 w-12 shrink-0 rounded-xl border border-[#f8d08b]/45 bg-linear-to-br from-[#facc15] to-[#f59e0b] inline-flex items-center justify-center text-[#1c1406] shadow-[0_10px_24px_rgba(250,204,21,0.25)]">
                        {certificateLevel.unlocked ? (
                          <Crown size={20} />
                        ) : (
                          <Lock size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f8d08b]/80">
                          Professional Badge
                        </p>
                        <h4 className="text-xl font-black text-[#fff8e8] leading-tight">
                          Python Mastery Certificate
                        </h4>
                        <p className="mt-1 text-sm text-[#e8d2a0]">
                          {certificateLevel.unlocked
                            ? "Unlocked. Open your certificate and share your achievement."
                            : certificateLevel.unlock_message ||
                              "Unlock after completing all levels."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] border ${
                          certificateLevel.unlocked
                            ? "border-[#f8d08b]/55 bg-[#f8d08b]/14 text-[#ffe8b5]"
                            : "border-[#6b5b38]/55 bg-[#46361b]/35 text-[#c8b080]"
                        }`}
                      >
                        {certificateLevel.unlocked ? "Unlocked" : "Locked"}
                      </span>
                      <ArrowRight
                        size={18}
                        className={
                          certificateLevel.unlocked
                            ? "text-[#f8d08b]"
                            : "text-[#7a6640]"
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#e6cf99]">
                      <span>
                        {completedChallenges}/{totalChallenges} levels complete
                      </span>
                      <span>{certificateProgressPercent}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full border border-[#6f5829]/45 bg-[#2a210f]/72">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#facc15] via-[#f59e0b] to-[#fde68a]"
                        style={{ width: `${certificateProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeMap;
