import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const HomeSkeleton = () => {
  return (
    <SkeletonPage className="relative">
      {/* Content — Track sections matching ChallengeMap layout */}
      <div className="relative z-10 w-full mt-0 px-6 pt-4 pb-0">
        <div className="h-full overflow-hidden space-y-6">
          {[...Array(3)].map((_, sectionIdx) => (
            <section
              key={sectionIdx}
              className="w-full rounded-xl border border-white/5 bg-[#111827]/70 p-5"
            >
              {/* Track header */}
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1.5">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-3 w-20" />
                </div>
                <SkeletonBase className="h-1.5 w-36 rounded-full" />
              </div>

              {/* Level cards grid - 5 columns like the real layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {[...Array(sectionIdx === 0 ? 10 : 10)].map((__, cardIdx) => (
                  <div
                    key={cardIdx}
                    className="rounded-xl border border-[#2e3d54] bg-[#111a2a] p-3 min-h-[130px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <SkeletonBase className="h-9 w-9 rounded-lg" />
                        <div className="space-y-1.5">
                          <SkeletonBase className="h-2.5 w-12" />
                          <SkeletonBase className="h-3.5 w-24" />
                        </div>
                      </div>
                      <SkeletonBase className="h-5 w-12 rounded-full" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <SkeletonBase className="h-3 w-10" />
                      <div className="flex gap-1">
                        <SkeletonBase className="h-3 w-3 rounded-full" />
                        <SkeletonBase className="h-3 w-3 rounded-full" />
                        <SkeletonBase className="h-3 w-3 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
};

export default HomeSkeleton;
