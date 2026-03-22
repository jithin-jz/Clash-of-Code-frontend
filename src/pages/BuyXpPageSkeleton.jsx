import React from "react";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonCard,
  SkeletonText,
} from "../common/SkeletonPrimitives";

const BuyXpPageSkeleton = () => {
  return (
    <SkeletonPage className="bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 blur-[80px] rounded-full" />

      {/* Main Content Grid Skeleton */}
      <main className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="space-y-3">
          <SkeletonText width="240px" height="2.5rem" className="opacity-90" />
          <SkeletonText width="400px" height="0.85rem" className="opacity-30" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard
              key={i}
              className="flex flex-col h-[320px] p-6 justify-between"
              variant="glass"
            >
              {/* Card Header Skeleton */}
              <div className="space-y-5">
                <SkeletonBase className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20" />
                <div className="space-y-2">
                  <SkeletonText
                    width="60px"
                    height="0.65rem"
                    className="opacity-40"
                  />
                  <SkeletonText width="140px" height="1.5rem" />
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <SkeletonText width="80px" height="1.25rem" />
                  <SkeletonText
                    width="40px"
                    height="0.65rem"
                    className="opacity-30"
                  />
                </div>
                <SkeletonBase className="h-12 w-full rounded-2xl bg-white/5 border border-white/10" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      </main>
    </SkeletonPage>
  );
};

export default BuyXpPageSkeleton;
