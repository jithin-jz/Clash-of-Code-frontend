import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { authAPI } from "../services/api";
import { notify } from "../services/notification";
import { Button } from "../components/ui/button";
import { AdminTableLoadingRow } from "./AdminSkeletons";

const StoreAnalytics = () => {
  const [data, setData] = useState({ items: [], total_xp_spent: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalCount = data.items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.items.slice(start, start + pageSize);
  }, [data.items, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getStoreAnalytics();
      setData(response.data);
    } catch {
      notify.error("Failed to fetch store analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 backdrop-blur-xl space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Total Revenue
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-semibold text-slate-100 tracking-tight">
              {data.total_xp_spent.toLocaleString()}
            </h3>
            <span className="text-sm font-medium text-slate-500">XP</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total aggregate expenditure across all users.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 backdrop-blur-xl space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Catalog Size
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-semibold text-slate-100 tracking-tight">
              {data.items.length}
            </h3>
            <span className="text-sm font-medium text-slate-500">Items</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Active items currently available in the store.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
          Item Performance
        </h2>

        <div className="rounded-lg border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 backdrop-blur-xl overflow-hidden">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent bg-[#111d30]/85">
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3 px-6">
                  Item
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                  Price
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                  Sales
                </TableHead>
                <TableHead className="text-right text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3 px-6">
                  Revenue
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <AdminTableLoadingRow colSpan={5} rows={6} />
              ) : (
                paginatedItems.map((item, idx) => (
                  <TableRow
                    key={`${item.name}-${idx}`}
                    className="border-white/10 hover:bg-white/5 transition-colors group"
                  >
                  <TableCell className="py-3 px-6">
                      <span className="text-sm font-medium text-slate-100 tracking-tight">
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="bg-[#162338]/60 border-white/10 text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md text-slate-300"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-xs text-slate-300">
                      {item.cost} XP
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                        <ShoppingCart size={12} className="text-slate-500" />
                        {item.sales}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3 px-6">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-100 tracking-tight">
                          {item.revenue.toLocaleString()} XP
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span>
                Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, totalCount)} of {totalCount}
              </span>
              <select
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-7 rounded-md bg-[#162338]/50 border border-white/10 text-slate-300 text-xs px-2"
              >
                <option value="10">10 / page</option>
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 border-white/10 bg-[#162338]/50 text-slate-300 hover:text-white hover:bg-white/10"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-slate-400">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 border-white/10 bg-[#162338]/50 text-slate-300 hover:text-white hover:bg-white/10"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreAnalytics;
