import React, { useMemo } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight, Crown, Lock } from "lucide-react";
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

const ChallengeMap = ({ levels, handleLevelClick }) => {
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
      sorted.find((l) => l.slug === "certificate" || l.type === "CERTIFICATE") ||
      null;

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
    <div className="w-full relative flex flex-col items-center">
      {/* MAIN CONTENT */}
      <div className="w-full px-3 sm:px-6">
        <div className="space-y-1 pb-4">
          {/* TRACK SECTIONS */}
          {TRACK_ORDER.map((track) => {
            const trackLevels = grouped[track] || [];
            if (!trackLevels.length) return null;
            const solved = trackProgress[track]?.solved || 0;

            return (
              <section
                key={track}
                className="px-4 py-2 sm:p-4"
              >
                <div className="mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {track}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {solved} / {trackLevels.length} completed
                    </p>
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

          {/* CERTIFICATE */}
          {certificateLevel && (
            <section className="px-4 pt-2 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] tracking-[0.25em] uppercase text-yellow-400 font-semibold">
                  Certification
                </h3>
                <span className="text-[11px] text-slate-500">
                  Final Milestone
                </span>
              </div>

              <button
                onClick={() => handleLevelClick(certificateLevel)}
                className={`w-full rounded-xl border p-5 text-left transition-all duration-300 backdrop-blur-md ${certificateLevel.unlocked
                  ? "border-yellow-400/40 bg-yellow-400/5 hover:bg-yellow-400/10 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)]"
                  : "border-white/5 bg-white/[0.02] cursor-not-allowed grayscale-[50%]"
                  }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-yellow-400 text-black flex items-center justify-center shrink-0">
                      {certificateLevel.unlocked ? (
                        <Crown size={18} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">
                        Python Mastery Certificate
                      </h4>

                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {certificateLevel.unlocked
                          ? "View and share your achievement."
                          : "Complete all levels to unlock."}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`shrink-0 mt-1 ${certificateLevel.unlocked
                      ? "text-yellow-400"
                      : "text-slate-600"
                      }`}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-2">
                    <span>
                      {completedChallenges} / {totalChallenges}
                    </span>
                    <span>{certificateProgressPercent}%</span>
                  </div>

                  <div className="h-1.5 rounded-full bg-[#1f2937] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
                      style={{ width: `${certificateProgressPercent}%` }}
                    />
                  </div>
                </div>
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeMap;
