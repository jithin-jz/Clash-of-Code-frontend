import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const MarketplacePageSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Unified Action Row Skeleton */}
      <div className="sticky top-14 z-20 border-b border-white/5 bg-[#0a0f18]/85 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3">
            <SkeletonBase className="w-8 h-8 rounded-lg shrink-0 -ml-1.5" />
            <div className="w-px h-5 bg-white/10 shrink-0 hidden sm:block" />

            <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-hidden">
              <SkeletonBase className="w-16 h-8 rounded-full" />
              <SkeletonBase className="w-20 h-8 rounded-full" />
              <SkeletonBase className="w-[4.5rem] h-8 rounded-full" />
              <SkeletonBase className="w-20 h-8 rounded-full" />
            </div>

            <SkeletonBase className="w-[4.5rem] h-8 rounded-full ml-1 shrink-0" />
          </div>
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#7ea3d9]/20 overflow-hidden bg-[#0f1b2e]/70"
            >
              {/* Preview Area */}
              <SkeletonBase className="h-32 rounded-none" />
              {/* Content */}
              <div className="p-4 space-y-3">
                <SkeletonBase className="h-4 w-3/4 rounded-md" />
                <SkeletonBase className="h-3 w-1/2 rounded-md" />
                <SkeletonBase className="h-9 w-full rounded-md mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
};

export default MarketplacePageSkeleton;
