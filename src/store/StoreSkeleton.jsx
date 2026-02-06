import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const StoreSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBase className="w-9 h-9 rounded-lg" />
              <SkeletonBase className="w-16 h-5 rounded-md" />
            </div>
            <SkeletonBase className="w-24 h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="border-b border-white/5 bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-2">
            <SkeletonBase className="w-14 h-7 rounded-md" />
            <SkeletonBase className="w-20 h-7 rounded-md" />
            <SkeletonBase className="w-16 h-7 rounded-md" />
            <SkeletonBase className="w-18 h-7 rounded-md" />
            <SkeletonBase className="w-18 h-7 rounded-md" />
          </div>
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/50"
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

export default StoreSkeleton;
