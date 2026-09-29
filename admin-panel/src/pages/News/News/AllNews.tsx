// src/pages/News/News/AllNews.tsx
import { useEffect, useState } from "react";
import {
  useGetNewsQuery,
  useDeleteNewsMutation,
  useUpdateNewsStatusMutation,
  type NewsRecord,
  type NewsStatus,
} from "./news.api";
import { useGetNewsCategoriesQuery } from "../NewsCategories/newsCategory.api";
import { extractApiError, getUploadUrl } from "../../../lib/apiClient";
import NewsModal from "./NewsModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput, FilterSelect } from "../../../components/common/SearchFilterBar";

// Rows-per-page choices shown in the dropdown — same set as AllAdminLogs.tsx.
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const STATUS_STYLES: Record<NewsStatus, string> = {
  draft: "bg-[#f3f7f5] text-[#71827d]",
  scheduled: "bg-amber-50 text-amber-600",
  published: "bg-green-50 text-green-600",
};

// Local-datetime <-> ISO helper for the inline schedule picker, same
// convention as NewsModal's toLocalInputValue.
function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Row-level status control. Draft/Published apply immediately; picking
// "Scheduled" opens an inline date/time prompt first since the backend
// requires a future scheduledAt whenever status is "scheduled".
function StatusCell({ news }: { news: NewsRecord }) {
  const [updateStatus, { isLoading }] = useUpdateNewsStatusMutation();
  const [pickingSchedule, setPickingSchedule] = useState(false);
  const [scheduleValue, setScheduleValue] = useState("");
  const [error, setError] = useState("");

  const applyStatus = async (status: NewsStatus, scheduledAtIso?: string | null) => {
    setError("");
    try {
      await updateStatus({ id: news.id, status, scheduledAt: scheduledAtIso ?? null }).unwrap();
      setPickingSchedule(false);
      setScheduleValue("");
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const handleChange = (value: NewsStatus) => {
    if (value === "scheduled") {
      setPickingSchedule(true);
      setScheduleValue(toLocalInputValue(news.scheduledAt) || toLocalInputValue(new Date().toISOString()));
      return;
    }
    applyStatus(value);
  };

  return (
    <div className="space-y-1 min-w-[150px]">
      <select
        value={news.status}
        onChange={(e) => handleChange(e.target.value as NewsStatus)}
        disabled={isLoading}
        className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border-0 cursor-pointer outline-none ${STATUS_STYLES[news.status]}`}
      >
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>

      {!pickingSchedule && news.status === "scheduled" && news.scheduledAt && (
        <p className="text-[10px] text-[#71827d]">{new Date(news.scheduledAt).toLocaleString()}</p>
      )}

      {pickingSchedule && (
        <div className="flex items-center gap-1 bg-[#f3f7f5] border border-[#d6e3df] rounded-lg p-1.5">
          <input
            type="datetime-local"
            value={scheduleValue}
            onChange={(e) => setScheduleValue(e.target.value)}
            className="text-[10px] bg-white border border-[#d6e3df] rounded px-1.5 py-1 outline-none w-[130px]"
          />
          <button
            type="button"
            disabled={isLoading || !scheduleValue}
            onClick={() => applyStatus("scheduled", new Date(scheduleValue).toISOString())}
            className="cursor-pointer text-[10px] font-bold px-2 py-1 rounded bg-[#0B5A48] text-white disabled:opacity-50"
          >
            Set
          </button>
          <button
            type="button"
            onClick={() => {
              setPickingSchedule(false);
              setScheduleValue("");
            }}
            className="cursor-pointer text-[10px] font-bold px-1.5 text-[#71827d]"
          >
            ✕
          </button>
        </div>
      )}

      {error && <p className="text-[9px] font-medium text-[#D4300F] max-w-[150px]">{error}</p>}
    </div>
  );
}

export default function AllNews() {
  const [page, setPage] = useState(1);
  // Rows-per-page, user-controlled via a dropdown next to the filters.
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  // Debounced copy of `search` — this is what actually goes into the
  // query args, so we don't refetch on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | "">("");
  const [filterStatus, setFilterStatus] = useState<NewsStatus | "">("");

  const { data: categoriesData } = useGetNewsCategoriesQuery({ page: 1, limit: 100 });
  const categories = categoriesData?.data ?? [];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: newsData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetNewsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: filterCategoryId || undefined,
    status: filterStatus || undefined,
  });

  const news = newsData?.data ?? [];
  const pagination = newsData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRecord | null>(null);

  const openAddModal = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const openEditModal = (news: NewsRecord) => {
    setEditingNews(news);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNews(null);
  };

  const [deleteNews] = useDeleteNewsMutation();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<NewsRecord | null>(null);
  const [actionError, setActionError] = useState("");

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await deleteNews(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const columns: DataTableColumn<NewsRecord>[] = [
    {
      header: "Cover",
      render: (a) => (
        <div className="w-12 h-12 rounded-lg border border-[#dce7e3] bg-[#f3f7f5] overflow-hidden flex items-center justify-center">
          {a.coverImageUrl ? (
            <img src={getUploadUrl(a.coverImageUrl) ?? undefined} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[8px] text-[#71827d]">—</span>
          )}
        </div>
      ),
    },
    {
      header: "Title",
      render: (a) => (
        <>
          <p className="font-semibold text-[#16322c] max-w-[280px] truncate">{a.title}</p>
          <p className="text-[#71827d]">{a.category.name} · by {a.author.name}</p>
        </>
      ),
    },
    {
      header: "Tags",
      render: (a) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {[...a.brands, ...a.models].slice(0, 3).map((t) => (
            <span key={t.id} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#f3f7f5] text-[#50655f]">
              {t.name}
            </span>
          ))}
          {a.brands.length + a.models.length > 3 && (
            <span className="text-[9px] text-[#71827d]">+{a.brands.length + a.models.length - 3}</span>
          )}
          {a.brands.length + a.models.length === 0 && <span className="text-[#71827d]">—</span>}
        </div>
      ),
    },
    {
      header: "Status",
      render: (a) => <StatusCell news={a} />,
    },
    {
      header: "Activity",
      render: (a) => (
        <div className="space-y-1 text-[10px] leading-snug">
          <p className="text-[#50655f]">
            <span className="font-semibold text-[#304942]">Created</span>{" "}
            {a.createdByAdmin?.name ?? "—"}
            <br />
            <span className="text-[#71827d]">{new Date(a.createdAt).toLocaleString()}</span>
          </p>
          <p className="text-[#50655f]">
            <span className="font-semibold text-[#304942]">Updated</span>{" "}
            {a.updatedByAdmin?.name ?? "—"}
            <br />
            <span className="text-[#71827d]">{new Date(a.updatedAt).toLocaleString()}</span>
          </p>
        </div>
      ),
    },
    {
      header: "Views",
      render: (a) => <span className="text-[#50655f]">{a.viewCount}</span>,
    },
    {
      header: "",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(a)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(a)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1300px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[18px] font-black text-[#16322c]">News</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">Write, schedule, and publish news.</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer text-[12px] font-bold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
        >
          + Add news
        </button>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          <p className="text-red-500 text-xs font-medium">{actionError}</p>
        </div>
      )}

      <SearchFilterBar
        right={
          <div className="flex items-center gap-3">
            {pagination && (
              <p className="text-[11px] text-[#71827d] whitespace-nowrap">
                {pagination.total} news{pagination.total === 1 ? "" : "s"} total
              </p>
            )}
            <div className="flex items-center gap-2">
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
        }
      >
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by title or slug..."
        />
        <FilterSelect
          value={filterCategoryId}
          onChange={(v) => {
            setFilterCategoryId(v ? Number(v) : "");
            setPage(1);
          }}
          placeholder="All categories"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <FilterSelect
          value={filterStatus}
          onChange={(v) => {
            setFilterStatus((v as NewsStatus) || "");
            setPage(1);
          }}
          placeholder="All statuses"
          options={[
            { value: "draft", label: "Draft" },
            { value: "scheduled", label: "Scheduled" },
            { value: "published", label: "Published" },
          ]}
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={news}
          rowKey={(a) => a.id}
          loading={loading}
          error={error}
          loadingMessage="Loading news..."
          emptyMessage="No news found."
        />
        <Pagination
          pagination={pagination ?? null}
          onPageChange={setPage}
          variant="compact"
          itemLabel="news"
          currentCount={news.length}
        />
      </div>

      {modalOpen && (
        <NewsModal
          key={editingNews ? `edit-${editingNews.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          news={editingNews}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete news?"
        itemName={pendingDelete?.title}
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}