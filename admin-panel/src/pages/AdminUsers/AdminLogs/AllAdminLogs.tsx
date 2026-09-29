// src/pages/AdminLogs/AllAdminLogs.tsx
import { useEffect, useState } from "react";
import { useGetAdminLogsQuery, type AdminLogRecord } from "./adminLog.api";
import { useGetAdminsQuery } from "../../AdminUsers/AllAdmins/admin.api";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import AdminPageHeader from "../../../components/common/AdminPageHeader";


const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export default function AllAdminLogs() {
  const { data: adminsData } = useGetAdminsQuery({ page: 1, limit: 100 });
  const admins = adminsData?.data ?? [];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [adminId, setAdminId] = useState<number | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetAdminLogsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    adminId: adminId || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortOrder: "desc",
  });

  const logs = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";
  const loading = isLoading || isFetching;

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

const columns: DataTableColumn<AdminLogRecord>[] = [
    {
      header: "Sr No",
      className: "font-mono",
      render: (log) => {
        const idx = logs.indexOf(log);
        return <span className="text-[#71827d]">{pagination ? (pagination.page - 1) * pagination.limit + idx + 1 : idx + 1}</span>;
      },
    },
    { header: "Admin", render: (log) => <span className="font-semibold text-[#16322c]">{log.admin.name}</span> },
    { header: "Action", render: (log) => <span className="text-[#304942]">{log.description ?? "—"}</span> },
    { header: "IP", className: "font-mono", render: (log) => <span className="text-[#71827d]">{log.ipAddress ?? "—"}</span> },
    { header: "Date & Time", render: (log) => <span className="text-[#50655f]">{formatDateTime(log.createdAt)}</span> },
  ];

  return (
    <div className="space-y-5 max-w-[1300px] mx-auto">
      <AdminPageHeader
        title="Admin activity logs"
        description="Audit log for sign-ins, account changes, roles, and permission updates."
      />

      <div className="admin-surface px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="admin-control flex items-center gap-2 flex-1 min-w-[220px] max-w-sm px-3 py-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#96a6a1" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search description..."
            className="flex-1 bg-transparent text-[12px] text-[#16322c] outline-none placeholder:text-[#96a6a1]"
          />
        </div>

        <select
          value={adminId}
          onChange={(e) => {
            setPage(1);
            setAdminId(e.target.value ? Number(e.target.value) : "");
          }}
          className="cursor-pointer text-[12px] text-[#304942] bg-[#f3f7f5] border border-[#dce7e3] rounded-lg px-3 py-2 outline-none"
        >
          <option value="">All admins</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setPage(1);
            setFromDate(e.target.value);
          }}
          className="text-[12px] text-[#304942] bg-[#f3f7f5] border border-[#dce7e3] rounded-lg px-3 py-2 outline-none"
        />
        <span className="text-[11px] text-[#96a6a1]">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setPage(1);
            setToDate(e.target.value);
          }}
          className="text-[12px] text-[#304942] bg-[#f3f7f5] border border-[#dce7e3] rounded-lg px-3 py-2 outline-none"
        />

        {(search || adminId || fromDate || toDate) && (
          <button
            onClick={() => {
              setSearch("");
              setAdminId("");
              setFromDate("");
              setToDate("");
              setPage(1);
            }}
            className="cursor-pointer text-[11px] font-semibold text-[#71827d] hover:text-[#0B5A48] transition-colors"
          >
            Clear filters
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] font-semibold text-[#71827d] whitespace-nowrap">Rows per page</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="cursor-pointer text-[12px] text-[#304942] bg-[#f3f7f5] border border-[#dce7e3] rounded-lg px-3 py-2 outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-surface overflow-hidden">
        <DataTable
          columns={columns}
          rows={logs}
          rowKey={(log) => log.id}
          loading={loading}
          error={error}
          loadingMessage="Loading logs..."
          emptyMessage="No activity matches these filters."
        />
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          variant="compact"
          itemLabel="log entries"
          currentCount={logs.length}
        />
      </div>
    </div>
  );
}
