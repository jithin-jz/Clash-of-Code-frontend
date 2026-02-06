import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const ProfileSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Header */}
      <div className="bg-[#09090b] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBase className="h-9 w-9 rounded-lg" />
              <SkeletonBase className="h-5 w-16 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBase className="h-9 w-9 rounded-lg" />
              <SkeletonBase className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-4">
              <SkeletonBase className="h-72 rounded-xl" />
              <SkeletonBase className="h-12 rounded-xl" />
              <SkeletonBase className="h-20 rounded-xl" />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <SkeletonBase className="h-80 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </SkeletonPage>
  );
};

export default ProfileSkeleton;
