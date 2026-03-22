import React from "react";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonText,
} from "../common/SkeletonPrimitives";

const ProfileSkeleton = () => {
  return (
    <SkeletonPage className="bg-black relative">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card Skeleton */}
          <div className="lg:col-span-3 space-y-6">
            <SkeletonCard className="p-0 overflow-hidden" variant="glass">
              <div className="h-40 bg-white/[0.015] relative shadow-inner">
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  <SkeletonAvatar
                    size="xl"
                    className="border-[6px] border-black shadow-2xl rounded-3xl"
                  />
                </div>
              </div>
              <div className="pt-16 pb-8 px-6 text-center space-y-6">
                <div className="space-y-3">
                  <SkeletonText
                    width="160px"
                    height="1.5rem"
                    className="mx-auto"
                  />
                  <SkeletonText
                    width="100px"
                    height="0.85rem"
                    className="mx-auto opacity-30 italic font-mono"
                  />
                </div>

                <div className="flex items-center justify-center gap-10 border-t border-white/5 pt-8 mt-4">
                  <div className="space-y-2 text-center">
                    <SkeletonText
                      width="30px"
                      height="1.5rem"
                      className="mx-auto"
                    />
                    <SkeletonText
                      width="70px"
                      height="0.65rem"
                      className="opacity-40 uppercase font-mono"
                    />
                  </div>
                  <div className="space-y-2 text-center">
                    <SkeletonText
                      width="30px"
                      height="1.5rem"
                      className="mx-auto"
                    />
                    <SkeletonText
                      width="70px"
                      height="0.65rem"
                      className="opacity-40 uppercase font-mono"
                    />
                  </div>
                </div>
              </div>
            </SkeletonCard>

            <SkeletonCard className="p-6 space-y-6" variant="solid">
              <div className="space-y-3">
                <SkeletonText
                  width="40%"
                  height="0.75rem"
                  className="opacity-40"
                />
                <SkeletonBase className="h-12 w-full rounded-2xl bg-white/[0.02]" />
              </div>
              <div className="space-y-4 pt-2 border-t border-white/5">
                <SkeletonText
                  width="60%"
                  height="0.65rem"
                  className="opacity-20"
                />
                <div className="flex gap-3">
                  <SkeletonBase className="flex-1 h-12 rounded-2xl bg-white/[0.02]" />
                  <SkeletonBase className="w-14 h-12 rounded-2xl bg-white/[0.05]" />
                </div>
              </div>
            </SkeletonCard>
          </div>

          {/* Center Column - Content Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            {/* Tabs / Header */}
            <div className="flex items-center justify-between gap-4 p-2 bg-white/[0.02] rounded-2xl border border-white/5 backdrop-blur-xl shrink-0 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <SkeletonBase
                    key={i}
                    className="h-10 w-24 rounded-xl shrink-0"
                  />
                ))}
              </div>
              <SkeletonBase className="h-11 w-40 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hidden sm:block" />
            </div>

            {/* Heatmap Section */}
            <SkeletonCard className="p-6" variant="solid">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <SkeletonBase className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-500/40" />
                  <SkeletonText
                    width="140px"
                    height="1.1rem"
                    className="opacity-90"
                  />
                </div>
                <SkeletonText
                  width="90px"
                  height="0.65rem"
                  className="opacity-20 uppercase tracking-[0.2em] font-mono"
                />
              </div>

              <div className="flex gap-1.5 overflow-hidden py-2 px-1">
                {[...Array(30)].map((_, w) => (
                  <div key={w} className="flex flex-col gap-1.5 shrink-0">
                    {[...Array(7)].map((_, d) => (
                      <div
                        key={d}
                        className={`w-[13px] h-[13px] rounded-sm transition-all duration-700 ${Math.random() > 0.85 ? "bg-emerald-500/20" : "bg-white/[0.03]"}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8 mt-4 border-t border-white/5">
                <SkeletonText
                  width="180px"
                  height="0.75rem"
                  className="opacity-20"
                />
                <div className="flex gap-2 items-center">
                  <SkeletonText
                    width="40px"
                    height="0.65rem"
                    className="opacity-20 font-mono mr-2"
                  />
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm bg-emerald-500/${(i + 1) * 10}`}
                    />
                  ))}
                </div>
              </div>
            </SkeletonCard>

            {/* Posts / Feed Section */}
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} className="p-6 space-y-6" variant="solid">
                <div className="flex gap-4">
                  <SkeletonAvatar size="md" className="rounded-2xl" />
                  <div className="space-y-2 flex-1 pt-1">
                    <SkeletonText width="140px" height="1rem" />
                    <SkeletonText
                      width="90px"
                      height="0.65rem"
                      className="opacity-20 font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <SkeletonText
                    width="98%"
                    height="0.85rem"
                    className="opacity-60"
                  />
                  <SkeletonText
                    width="85%"
                    height="0.85rem"
                    className="opacity-60"
                  />
                </div>
                <SkeletonBase className="h-72 w-full rounded-[1.5rem] bg-white/[0.015] border border-white/10" />
              </SkeletonCard>
            ))}
          </div>

          {/* Right Column - User List */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <SkeletonCard className="p-0 overflow-hidden" variant="glass">
                <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                  <SkeletonText
                    width="140px"
                    height="0.85rem"
                    className="opacity-50 uppercase font-bold"
                  />
                </div>
                <div className="p-5 space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <SkeletonAvatar
                        size="sm"
                        className="rounded-xl border border-white/5 shadow-md flex-shrink-0"
                      />
                      <div className="space-y-2 flex-1 min-w-0">
                        <SkeletonText width="90%" height="0.85rem" />
                        <SkeletonText
                          width="60%"
                          height="0.65rem"
                          className="opacity-20 font-mono"
                        />
                      </div>
                      <SkeletonBase className="h-8 w-16 rounded-xl shrink-0" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </div>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
};

export default ProfileSkeleton;
