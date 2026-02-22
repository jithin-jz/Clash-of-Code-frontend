import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const ProfileSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-hidden px-4 sm:px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-4 min-w-0">
              <SkeletonBase className="h-72 rounded-2xl" />
              <SkeletonBase className="h-12 rounded-xl" />
              <SkeletonBase className="h-20 rounded-xl" />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-3">
              <SkeletonBase className="h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    </SkeletonPage>
  );
};

export default ProfileSkeleton;
