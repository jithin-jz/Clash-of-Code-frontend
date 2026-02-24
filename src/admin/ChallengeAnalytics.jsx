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
import { TrendingUp, Star, CheckCircle } from "lucide-react";
import { authAPI } from "../services/api";
import { notify } from "../services/notification";
import { Button } from "../components/ui/button";
import { AdminTableLoadingRow } from "./AdminSkeletons";

const ChallengeAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalCount = analytics.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedAnalytics = useMemo(() => {
    const start = (page - 1) * pageSize;
    return analytics.slice(start, start + pageSize);
  }, [analytics, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getChallengeAnalytics();
      setAnalytics(response.data);
    } catch {
      notify.error("Failed to fetch challenge analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">
          Challenge Performance
        </h2>
      </div>

      <div className="rounded-lg border border-[#7ea3d9]/20 bg-[#0f1b2e]/70 backdrop-blur-xl overflow-hidden">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent bg-[#111d30]/85">
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3 px-6">
                Challenge
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                Completions
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                Success Rate
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">
                Avg Stars
              </TableHead>
              <TableHead className="text-right text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3 px-6">
                Type
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <AdminTableLoadingRow colSpan={5} rows={6} />
            ) : (
              paginatedAnalytics.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-white/10 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="py-3 px-6">
                    <span className="text-sm font-medium text-slate-100 tracking-tight">
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                      <CheckCircle size={12} className="text-slate-500" />
                      {item.completions}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                      <TrendingUp size={12} className="text-slate-500" />
                      {item.completion_rate.toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1 text-slate-300 font-mono text-xs">
                      <Star size={12} className="text-slate-500" />
                      {item.avg_stars.toFixed(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 px-6">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border-white/10 bg-[#162338]/60 ${
                        item.is_personalized ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {item.is_personalized ? "Generated" : "Standard"}
                    </Badge>
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
  );
};

export default ChallengeAnalytics;
