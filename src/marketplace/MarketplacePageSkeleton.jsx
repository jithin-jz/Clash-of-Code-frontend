import React from "react";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonCard,
  SkeletonText,
} from "../common/SkeletonPrimitives";

const MarketplacePageSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col bg-black relative">
      {/* Category Tabs Skeleton */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-3 sm:py-4">
            <SkeletonBase className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
              {[...Array(6)].map((_, i) => (
                <SkeletonBase
                  key={i}
                  className="h-10 w-28 rounded-xl shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12 relative z-10">
        {/* Section Heading */}
        <div className="space-y-3">
          <SkeletonText width="280px" height="2.5rem" className="opacity-90" />
          <SkeletonText width="450px" height="0.85rem" className="opacity-30" />
        </div>

        {/* Marketplace Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard
              key={i}
              className="group p-0 overflow-hidden"
              variant="solid"
            >
              {/* Item Preview Skeleton */}
              <div className="aspect-video relative overflow-hidden bg-white/[0.01]">
                <SkeletonBase className="h-full w-full rounded-none border-0" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <SkeletonBase className="h-6 w-20 rounded-full" />
                </div>
              </div>

              {/* Item Info */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2.5 flex-1 min-w-0 pt-1">
                    <SkeletonText width="90%" height="1.25rem" />
                    <SkeletonText
                      width="60%"
                      height="0.65rem"
                      className="opacity-30"
                    />
                  </div>
                  <SkeletonBase className="h-11 w-11 rounded-2xl border border-white/5" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 relative">
                    <SkeletonBase className="h-6 w-6 rounded-lg opacity-40" />
                    <SkeletonText
                      width="70px"
                      height="1.1rem"
                      className="opacity-80"
                    />
                  </div>
                  <SkeletonBase className="h-11 w-28 rounded-2xl" />
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
};

export default MarketplacePageSkeleton;
