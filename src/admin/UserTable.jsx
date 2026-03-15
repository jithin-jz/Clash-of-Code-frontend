import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RefreshCw, Eye, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminTableLoadingRow } from "./AdminSkeletons";

const UserTable = ({
  userList,
  tableLoading,
  currentUser,
  handleBlockToggle,
  handleDeleteUser,
  fetchUsers,
  userFilters,
  onUsersQueryChange,
}) => {
  const [searchValue, setSearchValue] = useState(userFilters?.search || "");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchValue(userFilters?.search || "");
  }, [userFilters?.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((userFilters?.search || "") !== searchValue) {
        onUsersQueryChange?.({ search: searchValue });
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchValue, userFilters?.search, onUsersQueryChange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [userFilters?.search, userFilters?.role, userFilters?.status]);

  const count = userList.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return userList.slice(startIndex, startIndex + pageSize);
  }, [userList, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const start = count > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = count > 0 ? Math.min(page * pageSize, count) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search username or email..."
            className="admin-control h-9 w-full min-w-0 sm:w-72 text-neutral-200"
          />
          <select
            value={userFilters?.role || ""}
            onChange={(e) => onUsersQueryChange?.({ role: e.target.value })}
            className="admin-control h-9 w-full sm:w-auto rounded-md text-xs px-3"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="staff">Staff</option>
            <option value="superuser">Superusers</option>
          </select>
          <select
            value={userFilters?.status || ""}
            onChange={(e) => onUsersQueryChange?.({ status: e.target.value })}
            className="admin-control h-9 w-full sm:w-auto rounded-md text-xs px-3"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="admin-control h-9 w-full sm:w-auto rounded-md text-xs px-3"
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchUsers(userFilters)}
          disabled={tableLoading}
          className="h-9 w-full gap-2 rounded-md border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:text-white sm:w-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="text-xs font-medium uppercase tracking-wider">
            {tableLoading ? "Refreshing..." : "Refresh"}
          </span>
        </Button>
      </div>

      <div className="space-y-3 md:hidden">
        {tableLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="admin-panel h-36 animate-pulse bg-white/[0.02]"
            />
          ))
        ) : paginatedUsers.length === 0 ? (
          <div className="admin-panel px-4 py-10 text-center text-sm italic text-neutral-500">
            No users found.
          </div>
        ) : (
          paginatedUsers.map((usr) => (
            <div key={usr.username} className="admin-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                    {usr.profile?.avatar_url ? (
                      <img
                        src={usr.profile.avatar_url}
                        alt={usr.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-neutral-500">
                        {usr.username[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-neutral-100">
                      {usr.username}
                      {currentUser.username === usr.username && (
                        <span className="ml-2 text-[10px] font-normal text-neutral-500">
                          (You)
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500">
                      {usr.email}
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  {usr.is_superuser ? (
                    <div className="rounded-md border border-red-500/15 bg-red-500/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-red-400">
                      Admin
                    </div>
                  ) : usr.is_staff ? (
                    <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-200">
                      Staff
                    </div>
                  ) : (
                    <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300">
                      User
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
                <div className="text-[11px] font-medium">
                  {usr.is_active ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <div className="h-1 w-1 rounded-full bg-emerald-400" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <div className="h-1 w-1 rounded-full bg-neutral-600" />
                      Blocked
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 text-neutral-400 hover:bg-white/10 hover:text-white rounded-md"
                  >
                    <Link to={`/profile/${usr.username}`} target="_blank">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(usr.username)}
                    disabled={currentUser.username === usr.username}
                    className="h-8 w-8 p-0 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBlockToggle(usr.username)}
                disabled={currentUser.username === usr.username}
                className={`mt-3 h-9 w-full rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                  usr.is_active
                    ? "border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-red-500/10 hover:text-red-400"
                    : "border-white/10 bg-white/[0.03] text-emerald-400 hover:bg-emerald-500/10"
                }`}
              >
                {usr.is_active ? "Block User" : "Unblock User"}
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden md:block admin-panel">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="border-white/10 bg-white/[0.02] hover:bg-transparent">
              <TableHead className="w-[80px] py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Avatar
              </TableHead>
              <TableHead className="py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                User
              </TableHead>
              <TableHead className="py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Role
              </TableHead>
              <TableHead className="py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Status
              </TableHead>
              <TableHead className="py-3 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableLoading ? (
              [...Array(6)].map((_, i) => (
                <AdminTableLoadingRow key={i} colSpan={5} />
              ))
            ) : userList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-neutral-500 text-sm italic"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((usr) => (
                <TableRow
                  key={usr.username}
                  className="border-white/10 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="py-3">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                      {usr.profile?.avatar_url ? (
                        <img
                          src={usr.profile.avatar_url}
                          alt={usr.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-500">
                          {usr.username[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-100 tracking-tight">
                        {usr.username}
                        {currentUser.username === usr.username && (
                          <span className="ml-2 text-[10px] text-neutral-500 font-normal">
                            (You)
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {usr.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      {usr.is_superuser ? (
                        <div className="rounded-md border border-red-500/15 bg-red-500/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-red-400">
                          Admin
                        </div>
                      ) : usr.is_staff ? (
                        <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-200">
                          Staff
                        </div>
                      ) : (
                        <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300">
                          User
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-[11px] font-medium">
                    {usr.is_active ? (
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <div className="h-1 w-1 rounded-full bg-emerald-400" />
                        Active
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <div className="w-1 h-1 rounded-full bg-neutral-600" />
                        Blocked
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md"
                      >
                        <Link to={`/profile/${usr.username}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlockToggle(usr.username)}
                        disabled={currentUser.username === usr.username}
                        className={`h-8 px-2 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-colors ${
                          usr.is_active
                            ? "text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {usr.is_active ? "Block" : "Unblock"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(usr.username)}
                        disabled={currentUser.username === usr.username}
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {start}-{end} of {count}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 px-3 border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:text-white sm:flex-none"
            disabled={page <= 1 || tableLoading}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </Button>
          <span className="min-w-0 text-center text-neutral-400">
            Page {page} / {Math.max(totalPages, 1)}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 px-3 border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06] hover:text-white sm:flex-none"
            disabled={page >= totalPages || tableLoading}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
