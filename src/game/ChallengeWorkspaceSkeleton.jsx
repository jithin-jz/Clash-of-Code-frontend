import React from "react";
import { SkeletonBase, SkeletonPage, SkeletonCode } from "../common/SkeletonPrimitives";

const ChallengeWorkspaceSkeleton = () => {
  return (
    <SkeletonPage className="flex flex-col h-dvh bg-[#0b1119]">
      <div className="absolute inset-0 pointer-events-none bg-[#0b1119]" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-[#101928] via-[#0d141f] to-[#0a0f17]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div className="absolute top-0 left-[8%] w-[26rem] h-[26rem] rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-8rem] right-[10%] w-[22rem] h-[22rem] rounded-full bg-[#0ea5e9]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 h-14 bg-[#0a1220]/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SkeletonBase className="w-9 h-9 rounded-xl" />
          <SkeletonBase className="w-48 h-5 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonBase className="w-4 h-4 rounded-sm" />
          <SkeletonBase className="w-24 h-10 rounded-xl" />
        </div>
      </div>

      <div className="relative z-10 flex-1 p-0 sm:p-3 gap-0 sm:gap-3 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[24rem] sm:rounded-2xl sm:border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 p-4 space-y-4">
          <SkeletonBase className="h-6 w-44" />
          <SkeletonBase className="h-10 w-full rounded-xl" />
          {[...Array(4)].map((_, i) => (
            <SkeletonBase key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="flex-1 min-w-0 sm:rounded-2xl sm:border border-[#7ea3d9]/20 bg-[#0f1b2e]/60 overflow-hidden flex flex-col">
          <div className="flex-1 p-2">
            <SkeletonCode lines={18} className="h-full" />
          </div>
          <div className="h-[35%] sm:h-[32%] min-h-[180px] border-t border-white/10 p-4 space-y-3">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-10 w-full rounded-lg" />
            <SkeletonBase className="h-10 w-5/6 rounded-lg" />
          </div>
        </div>

        <div className="w-full lg:w-[22rem] sm:rounded-2xl sm:border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <SkeletonBase className="h-4 w-24" />
            <SkeletonBase className="h-4 w-14" />
          </div>
          <div className="flex-1">
            <SkeletonBase className="h-full w-full rounded-xl" />
          </div>
          <SkeletonBase className="h-10 w-full rounded-xl mt-4" />
        </div>
      </div>
    </SkeletonPage>
  );
};

export default ChallengeWorkspaceSkeleton;
