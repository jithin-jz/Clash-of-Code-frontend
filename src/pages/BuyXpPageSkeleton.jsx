import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const BuyXpPageSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Main Content Skeleton */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0f1b2e]/70 border border-[#7ea3d9]/20 rounded-2xl p-5 flex flex-col gap-4"
            >
              <SkeletonBase className="w-10 h-10 rounded-lg" />

              {/* Label & Amount */}
              <div className="space-y-3">
                <SkeletonBase className="w-16 h-4 rounded" />
                <div className="flex items-baseline gap-1">
                  <SkeletonBase className="w-20 h-8 rounded" />
                  <SkeletonBase className="w-4 h-3 rounded" />
                </div>
              </div>

              {/* Bonus Tag */}
              <SkeletonBase className="w-24 h-3 rounded opacity-30" />

              {/* Button */}
              <SkeletonBase className="w-full h-10 rounded-lg mt-auto" />
            </div>
          ))}
        </div>
      </main>
    </SkeletonPage>
  );
};

export default BuyXpPageSkeleton;
