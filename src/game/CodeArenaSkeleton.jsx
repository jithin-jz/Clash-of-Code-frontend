import React from "react";
import {
  SkeletonBase,
  SkeletonCode,
  SkeletonTabs,
  SkeletonAvatar,
} from "../common/SkeletonPrimitives";

/**
 * CodeArena skeleton loader - displays while challenge data is loading
 */
const CodeArenaSkeleton = () => {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header Bar Skeleton */}
      <div className="h-14 flex items-center justify-between px-4 bg-[#09090b] border-b border-white/5">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-4">
          <SkeletonBase className="w-10 h-10 rounded-lg" />
          <SkeletonBase className="w-48 h-5 rounded-md" />
        </div>

        {/* Right: Status + Run button */}
        <div className="flex items-center gap-3">
          <SkeletonBase className="w-24 h-6 rounded-full" />
          <SkeletonBase className="w-20 h-10 rounded-lg" />
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor Pane (2/3 width) */}
        <div className="w-2/3 flex flex-col border-r border-white/5">
          {/* Editor Header */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-[#1a1a1a]">
            <SkeletonBase className="w-24 h-5 rounded-md" />
            <div className="flex gap-2">
              <SkeletonBase className="w-16 h-6 rounded-md" />
              <SkeletonBase className="w-16 h-6 rounded-md" />
            </div>
          </div>

          {/* Code Editor Skeleton */}
          <div className="flex-1 p-2">
            <SkeletonCode lines={20} className="h-full" />
          </div>
        </div>

        {/* Right: Problem/Console Pane (1/3 width) */}
        <div className="w-1/3 flex flex-col bg-[#09090b]">
          {/* Tab Navigation */}
          <SkeletonTabs count={3} />

          {/* Tab Content Skeleton */}
          <div className="flex-1 p-4 space-y-4 overflow-hidden">
            {/* Problem Description Mock */}
            <div className="space-y-3">
              <SkeletonBase className="w-32 h-4 rounded-md" />
              <div className="space-y-2">
                <SkeletonBase className="w-full h-3 rounded" />
                <SkeletonBase className="w-5/6 h-3 rounded" />
                <SkeletonBase className="w-4/6 h-3 rounded" />
                <SkeletonBase className="w-full h-3 rounded" />
                <SkeletonBase className="w-3/4 h-3 rounded" />
              </div>
            </div>

            {/* Example Section Mock */}
            <div className="mt-6 space-y-3">
              <SkeletonBase className="w-20 h-4 rounded-md" />
              <SkeletonBase className="w-full h-20 rounded-lg" />
            </div>

            {/* Hints Section Mock */}
            <div className="mt-6 space-y-3">
              <SkeletonBase className="w-16 h-4 rounded-md" />
              <SkeletonBase className="w-full h-12 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeArenaSkeleton;
