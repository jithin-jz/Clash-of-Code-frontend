import React from "react";
import { motion as Motion } from "framer-motion";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonCard,
  SkeletonText,
  SkeletonCircle
} from "../common/SkeletonPrimitives";

const HomeSkeleton = () => {
  return (
    <SkeletonPage className="relative bg-[#060a11]">
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-[1600px] mx-auto space-y-12">

          {/* Track Sections */}
          {[...Array(3)].map((_, sectionIdx) => (
            <section key={sectionIdx} className="space-y-6">
              {/* Track Header Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <SkeletonCircle className="h-10 w-10 border border-blue-500/20" />
                    <SkeletonText width="180px" height="1.75rem" />
                  </div>
                  <SkeletonText width="240px" height="0.875rem" className="opacity-50" />
                </div>
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    <span>Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <SkeletonBase className="h-full w-0" />
                  </div>
                </div>
              </div>

              {/* Levels Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[...Array(5)].map((__, cardIdx) => (
                  <SkeletonCard
                    key={cardIdx}
                    className="h-[180px] flex flex-col justify-between p-5 border border-white/5"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <SkeletonBase className="h-12 w-12 rounded-2xl border border-white/10" />
                        <div className="flex flex-col items-end gap-1.5">
                          <SkeletonBase className="h-5 w-14 rounded-full" />
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <SkeletonCircle key={i} className="h-3 w-3" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <SkeletonText width="40%" height="0.65rem" className="opacity-40" />
                        <SkeletonText width="80%" height="1.1rem" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <SkeletonText width="60px" height="0.75rem" />
                      <SkeletonBase className="h-8 w-20 rounded-lg" />
                    </div>
                  </SkeletonCard>
                ))}
              </div>
            </section>
          ))}

          {/* Certificate Section Skeleton */}
          <section className="mt-16 pb-20">
            <SkeletonCard className="p-8 border border-[#ffa116]/10 bg-gradient-to-br from-[#ffa116]/5 to-transparent">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <SkeletonBase className="h-24 w-24 rounded-3xl shrink-0 rotate-3 border border-[#ffa116]/20 shadow-[0_0_30px_rgba(255,161,22,0.1)]" />
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                  <div className="space-y-2">
                    <SkeletonText width="260px" height="1.5rem" className="mx-auto md:mx-0" />
                    <SkeletonText width="320px" height="0.875rem" className="mx-auto md:mx-0 opacity-50" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto md:mx-0">
                    <div className="flex justify-between items-end">
                      <SkeletonText width="100px" height="0.75rem" />
                      <SkeletonText width="40px" height="0.75rem" />
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <SkeletonBase className="h-full w-1/3 bg-[#ffa116]/30" />
                    </div>
                  </div>
                </div>
                <SkeletonBase className="h-12 w-40 rounded-xl shrink-0 invisible md:visible" />
              </div>
            </SkeletonCard>
          </section>

        </div>
      </Motion.div>
    </SkeletonPage>
  );
};

export default HomeSkeleton;
