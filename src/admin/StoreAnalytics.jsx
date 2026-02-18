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
import { Loader2, DollarSign, BarChart3, ShoppingCart } from "lucide-react";
import { authAPI } from "../services/api";
import { notify } from "../services/notification";
import { Button } from "../components/ui/button";

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
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Total Revenue
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-semibold text-white tracking-tight">
              {data.total_xp_spent.toLocaleString()}
            </h3>
            <span className="text-sm font-medium text-zinc-600">XP</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Total aggregate expenditure across all users.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Catalog Size
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-semibold text-white tracking-tight">
              {data.items.length}
            </h3>
            <span className="text-sm font-medium text-zinc-600">Items</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Active items currently available in the store.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Item Performance
        </h2>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/50">
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3 px-6">
                  Item
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                  Price
                </TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                  Sales
                </TableHead>
                <TableHead className="text-right text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3 px-6">
                  Revenue
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-700" />
                      <span className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
                        Loading...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((item, idx) => (
                  <TableRow
                    key={`${item.name}-${idx}`}
                    className="border-zinc-800 hover:bg-zinc-900/40 transition-colors group"
                  >
                    <TableCell className="py-3 px-6">
                      <span className="text-sm font-medium text-white tracking-tight">
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="bg-zinc-900 border-zinc-800 text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md text-zinc-400"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-xs text-zinc-400">
                      {item.cost} XP
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
                        <ShoppingCart size={12} className="text-zinc-600" />
                        {item.sales}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3 px-6">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-white tracking-tight">
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
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-2">
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
                className="h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2"
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
                className="h-7 px-2 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-zinc-400">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
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
