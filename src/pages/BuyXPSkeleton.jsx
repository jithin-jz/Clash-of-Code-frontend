import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const BuyXPSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#09090b] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBase className="h-9 w-9 rounded-lg" />
              <SkeletonBase className="h-5 w-16 rounded" />
            </div>
            <SkeletonBase className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <SkeletonBase key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      </main>
    </SkeletonPage>
  );
};

export default BuyXPSkeleton;
