import React from "react";
import { SkeletonBase, SkeletonPage } from "../common/SkeletonPrimitives";
import { TableCell, TableRow } from "../components/ui/table";

export const AdminPageSkeleton = () => (
  <SkeletonPage className="flex h-screen overflow-hidden flex-col md:flex-row">
    <aside className="hidden md:block w-[260px] h-full border-r border-white/10 bg-[#0a1220]/85 p-5 space-y-4">
      <SkeletonBase className="h-8 w-28 rounded-md" />
      <SkeletonBase className="h-11 w-full rounded-xl" />
      <SkeletonBase className="h-11 w-full rounded-xl" />
      <SkeletonBase className="h-11 w-full rounded-xl" />
      <SkeletonBase className="h-11 w-full rounded-xl" />
      <SkeletonBase className="h-11 w-full rounded-xl" />
    </aside>
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
      <SkeletonBase className="h-10 w-72 rounded-xl" />
      <SkeletonBase className="h-36 w-full rounded-2xl" />
      <SkeletonBase className="h-10 w-64 rounded-xl" />
      <SkeletonBase className="h-[420px] w-full rounded-2xl" />
    </main>
  </SkeletonPage>
);

export const AdminTableLoadingRow = ({ colSpan = 5, rows = 6 }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-4">
      <div className="space-y-2">
        {[...Array(rows)].map((_, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-3">
            <SkeletonBase className="h-8 rounded-md" />
            <SkeletonBase className="h-8 rounded-md" />
            <SkeletonBase className="h-8 rounded-md" />
            <SkeletonBase className="h-8 rounded-md" />
            <SkeletonBase className="h-8 rounded-md" />
          </div>
        ))}
      </div>
    </TableCell>
  </TableRow>
);
