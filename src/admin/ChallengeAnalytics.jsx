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
import { Loader2, TrendingUp, Star, CheckCircle } from "lucide-react";
import { authAPI } from "../services/api";
import { notify } from "../services/notification";
import { Button } from "../components/ui/button";

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Challenge Performance
        </h2>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/50">
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3 px-6">
                Challenge
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                Completions
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                Success Rate
              </TableHead>
              <TableHead className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3">
                Avg Stars
              </TableHead>
              <TableHead className="text-right text-[10px] font-medium uppercase tracking-wider text-zinc-500 py-3 px-6">
                Type
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
              paginatedAnalytics.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-zinc-800 hover:bg-zinc-900/40 transition-colors group"
                >
                  <TableCell className="py-3 px-6">
                    <span className="text-sm font-medium text-white tracking-tight">
                      {item.title}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs">
                      <CheckCircle size={12} className="text-zinc-500" />
                      {item.completions}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs">
                      <TrendingUp size={12} className="text-zinc-500" />
                      {item.completion_rate.toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1 text-zinc-300 font-mono text-xs">
                      <Star size={12} className="text-zinc-500" />
                      {item.avg_stars.toFixed(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3 px-6">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border-zinc-800 bg-zinc-900 ${
                        item.is_personalized ? "text-zinc-400" : "text-zinc-500"
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
  );
};

export default ChallengeAnalytics;
