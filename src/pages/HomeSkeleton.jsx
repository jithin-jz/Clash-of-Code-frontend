import React from "react";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonText,
  SkeletonCard,
} from "../common/SkeletonPrimitives";

const HomeSkeleton = () => {
  return (
    <SkeletonPage className="bg-[#050505] relative overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.04] blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/[0.03] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* Top Navigation Placeholder */}
      <div className="sticky top-0 z-50 h-16 bg-black/40 backdrop-blur-3xl border-b border-white/[0.05] flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <SkeletonBase className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20" />
          <div className="hidden sm:flex gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonBase
                key={i}
                className="h-4 w-20 rounded-full opacity-20"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 pr-4">
            <SkeletonBase className="h-8 w-8 rounded-xl bg-emerald-500/20" />
            <SkeletonText width="60px" height="0.85rem" />
          </div>
          <SkeletonBase className="w-10 h-10 rounded-xl bg-white/5 border border-white/5" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10">
        {/* Overall progress skeleton - High-End Header */}
        <div className="mb-12">
          <div className="rounded-[2.5rem] border border-white/[0.05] bg-white/[0.01] backdrop-blur-3xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <SkeletonBase className="w-16 h-16 rounded-[1.25rem] bg-emerald-500/5 border border-emerald-500/10 shrink-0" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500/40 rounded-full blur-[4px] animate-pulse" />
              </div>
              <div className="space-y-3 pt-1 flex-1">
                <SkeletonText
                  width="120px"
                  height="0.65rem"
                  className="opacity-30 tracking-widest uppercase font-mono"
                />
                <SkeletonText
                  width="280px"
                  height="2rem"
                  className="opacity-90"
                />
              </div>
            </div>
            <div className="sm:w-80 space-y-4">
              <div className="flex justify-between items-end">
                <SkeletonText
                  width="110px"
                  height="0.75rem"
                  className="opacity-20 font-mono"
                />
                <SkeletonText
                  width="50px"
                  height="1rem"
                  className="opacity-80"
                />
              </div>
              <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/20 to-emerald-500/40 w-[45%]" />
                <div className="absolute inset-0 bg-white/[0.02] animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Track Sections */}
        {[...Array(2)].map((_, sectionIdx) => (
          <section key={sectionIdx} className="mb-16">
            <div className="mb-8 flex items-end justify-between gap-8 px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-emerald-500/30" />
                  <SkeletonText
                    width="180px"
                    height="1.5rem"
                    className="opacity-90"
                  />
                </div>
                <SkeletonText
                  width="350px"
                  height="0.85rem"
                  className="opacity-20 ml-11"
                />
              </div>
              <div className="hidden md:block shrink-0">
                <SkeletonBase className="h-10 w-32 rounded-2xl bg-white/[0.03] border border-white/5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 px-1">
              {[...Array(5)].map((__, cardIdx) => (
                <SkeletonCard
                  key={cardIdx}
                  className="min-h-[160px] p-6 flex flex-col justify-between group"
                  variant="solid"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shrink-0">
                      <SkeletonBase className="w-6 h-6 rounded-md opacity-20" />
                    </div>
                    <SkeletonBase className="w-10 h-10 rounded-full opacity-5" />
                  </div>

                  <div className="space-y-2 mt-auto">
                    <SkeletonText
                      width="100%"
                      height="1.1rem"
                      className="opacity-80"
                    />
                    <div className="flex justify-between items-center pt-2">
                      <SkeletonBase className="h-5 w-16 rounded-lg bg-emerald-500/10 opacity-30" />
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((s) => (
                          <div
                            key={s}
                            className="w-2.5 h-2.5 rounded-full bg-white/[0.05]"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </SkeletonCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SkeletonPage>
  );
};

export default HomeSkeleton;
