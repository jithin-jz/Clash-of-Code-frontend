import React from "react";
import { SkeletonBase, SkeletonPage } from "./SkeletonPrimitives";

const Loader = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <SkeletonPage className="flex items-center justify-center">
      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#0f1b2e]/70 p-6 space-y-4">
        <SkeletonBase className="h-7 w-40 rounded-md" />
        <SkeletonBase className="h-11 w-full rounded-xl" />
        <SkeletonBase className="h-11 w-full rounded-xl" />
        <SkeletonBase className="h-11 w-full rounded-xl" />
      </div>
    </SkeletonPage>
  );
};

export default Loader;
