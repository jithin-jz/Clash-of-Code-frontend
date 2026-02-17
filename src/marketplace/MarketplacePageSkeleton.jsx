import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const MarketplacePageSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-[#0a1220]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBase className="w-9 h-9 rounded-xl" />
              <SkeletonBase className="w-16 h-5 rounded-md" />
            </div>
            <SkeletonBase className="w-24 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="border-b border-white/10 bg-[#0a1220]/75 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 py-2.5">
            <SkeletonBase className="w-16 h-8 rounded-full" />
            <SkeletonBase className="w-20 h-8 rounded-full" />
            <SkeletonBase className="w-[4.5rem] h-8 rounded-full" />
            <SkeletonBase className="w-20 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
