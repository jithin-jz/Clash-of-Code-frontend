import React from "react";
import {
  SkeletonBase,
  SkeletonPage,
  SkeletonCard,
  SkeletonText,
} from "../common/SkeletonPrimitives";
import { TableCell, TableRow } from "../components/ui/table";

/**
 * Reusable Stat Card Skeleton
 */
export const StatCardSkeleton = () => (
  <SkeletonCard className="p-6 h-36" variant="solid">
    <div className="flex justify-between items-start mb-6">
      <SkeletonText
        width="50%"
        height="0.75rem"
        className="opacity-40 uppercase tracking-widest font-mono"
      />
      <SkeletonBase className="h-10 w-10 rounded-xl bg-white/5 border border-white/10" />
    </div>
    <div className="space-y-2">
      <SkeletonText width="60%" height="2rem" />
      <SkeletonText width="30%" height="0.65rem" className="opacity-20" />
    </div>
  </SkeletonCard>
);

/**
 * Reusable Table Row Skeleton
 */
export const AdminTableLoadingRow = ({ colSpan = 5 }) => (
  <TableRow className="border-white/[0.05] hover:bg-transparent">
    {[...Array(colSpan)].map((_, i) => (
      <TableCell key={i} className="py-5">
        <SkeletonBase className="h-6 w-full rounded-lg opacity-40 bg-white/[0.03]" />
      </TableCell>
    ))}
  </TableRow>
);

/**
 * High-Level Page Skeletons
 */
export const AnalyticsSkeleton = () => (
  <div className="space-y-8 relative z-10">
    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Main Content Areas */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <SkeletonCard className="h-[400px]" variant="glass" />
        <SkeletonCard className="h-[300px]" variant="solid" />
      </div>
      <div className="lg:col-span-4 space-y-6">
        <SkeletonCard className="h-[250px]" variant="solid" />
        <SkeletonCard className="h-[450px]" variant="solid" />
      </div>
    </div>
  </div>
);

export const AdminPageSkeleton = () => (
  <SkeletonPage className="flex h-screen overflow-hidden flex-col md:flex-row bg-[#050505]">
    <aside className="hidden md:flex flex-col w-[280px] h-full border-r border-white/[0.05] bg-black/40 backdrop-blur-3xl p-6 space-y-8 z-30">
      <div className="px-2">
        <SkeletonBase className="h-10 w-32 rounded-xl bg-white/5 border border-white/10" />
      </div>
      <div className="space-y-3 mt-4 flex-1">
        {[...Array(6)].map((_, i) => (
          <SkeletonBase
            key={i}
            className="h-12 w-full rounded-2xl bg-white/[0.02] border border-transparent shadow-sm"
          />
        ))}
      </div>
      <div className="pt-6 border-t border-white/5 px-2">
        <SkeletonBase className="h-12 w-full rounded-2xl bg-white/[0.05]" />
      </div>
    </aside>
    <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto relative bg-[#050505]/40 backdrop-blur-sm">
      <div className="mb-10 space-y-3 relative z-20">
        <SkeletonText width="240px" height="2.5rem" className="opacity-90" />
        <SkeletonText
          width="380px"
          height="0.85rem"
          className="opacity-30 font-mono tracking-tight"
        />
      </div>
      <AnalyticsSkeleton />
    </main>
  </SkeletonPage>
);
