import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";

const HomeSkeleton = () => {
  return (
    <SkeletonPage className="relative">
      <div className="relative z-10 h-16 border-b border-white/10 bg-[#0a1220]/85 backdrop-blur-xl px-3 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-28 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
        </div>
        <SkeletonBase className="w-44 h-5 rounded-md" />
        <div className="flex items-center gap-2 justify-self-end">
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-10 h-10 rounded-full" />
          <SkeletonBase className="w-24 h-10 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 h-[calc(100vh-64px)] mt-0 px-3 sm:px-5 lg:px-6 pt-3 pb-0">
        <div className="h-full overflow-hidden space-y-4">
          <section className="w-full rounded-2xl border border-white/12 bg-white/[0.04] p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/15 bg-[#101a29]/65 p-4">
                  <SkeletonBase className="h-3 w-20 mb-3" />
                  <SkeletonBase className="h-10 w-24" />
                </div>
              ))}
            </div>
          </section>

          {[...Array(3)].map((_, sectionIdx) => (
            <section key={sectionIdx} className="w-full rounded-2xl border border-white/12 bg-[#0f1827]/64 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <SkeletonBase className="h-6 w-40" />
                  <SkeletonBase className="h-3 w-24" />
                </div>
                <SkeletonBase className="h-2 w-36 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {[...Array(6)].map((__, cardIdx) => (
                  <div key={cardIdx} className="rounded-2xl border border-white/12 bg-[#111a2a] p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <SkeletonBase className="h-10 w-10 rounded-xl" />
                        <div className="space-y-2">
                          <SkeletonBase className="h-3 w-16" />
                          <SkeletonBase className="h-6 w-32" />
                        </div>
                      </div>
                      <SkeletonBase className="h-5 w-14 rounded-full" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <SkeletonBase className="h-4 w-12" />
                      <SkeletonBase className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
};

export default HomeSkeleton;
