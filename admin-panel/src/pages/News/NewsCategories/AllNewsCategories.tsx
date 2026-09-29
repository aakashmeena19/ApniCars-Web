// src/pages/News/NewsCategories/AllNewsCategories.tsx
import { useEffect, useState } from "react";
import {
  useGetNewsCategoriesQuery,
  useUpdateNewsCategoryStatusMutation,
  useDeleteNewsCategoryMutation,
  type NewsCategoryRecord,
} from "./newsCategory.api";
import { extractApiError } from "../../../lib/apiClient";
import NewsCategoryModal from "./NewsCategoryModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput } from "../../../components/common/SearchFilterBar";

const ACCENT = "#0B5A48";
// Rows-per-page choices shown in the dropdown — same set as AllAdminLogs.tsx.
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Small pill-style toggle switch — same pattern as AllBrands.tsx's
// StatusToggle / AllCountries.tsx's StatusToggle / AllCities.tsx's
// FlagToggle.
function StatusToggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className="cursor-pointer relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: checked ? ACCENT : "#d6e3df" }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(18px)" : "translateX(3px)" }}
      />
    </button>
  );
}

// "12 Jul 2026, 4:30 pm" — compact enough for a table cell.
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AllNewsCategories() {
  const [page, setPage] = useState(1);
  // Rows-per-page, user-controlled via a dropdown next to the filters.
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  // Debounced copy of `search` — this is what actually goes into the
  // query args, so we don't refetch on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: categoriesData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetNewsCategoriesQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const categories = categoriesData?.data ?? [];
  const pagination = categoriesData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  // Modal state — null category = "Add" mode, a record = "Edit" mode.
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategoryRecord | null>(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: NewsCategoryRecord) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const [updateNewsCategoryStatus] = useUpdateNewsCategoryStatusMutation();
  const [deleteNewsCategory] = useDeleteNewsCategoryMutation();

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Row pending delete confirmation — set on "Delete" click, cleared on
  // cancel/confirm. Drives the shared ConfirmDialog popup (which itself
  // makes the admin wait a few seconds before the Confirm button
  // enables — no accidental deletes).
  const [pendingDelete, setPendingDelete] = useState<NewsCategoryRecord | null>(null);
  // Backend blocks this delete with a friendly message when news
  // are still filed under the category (see newsCategory.service.ts's
  // deleteNewsCategory) — this surfaces that message right here.
  const [actionError, setActionError] = useState("");

  const handleToggleStatus = async (category: NewsCategoryRecord) => {
    setActionError("");
    setTogglingId(category.id);
    try {
      await updateNewsCategoryStatus({ id: category.id, isActive: !category.isActive }).unwrap();
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await deleteNewsCategory(pendingDelete.id).unwrap();
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

  const columns: DataTableColumn<NewsCategoryRecord>[] = [
    {
      header: "Name",
      render: (c) => (
        <>
          <p className="font-semibold text-[#16322c]">{c.name}</p>
          <p className="text-[#71827d]">{c.slug}</p>
        </>
      ),
    },
    {
      header: "News",
      render: (c) => <span className="text-[#50655f]">{c.newsCount}</span>,
    },
    {
      header: "Status",
      render: (c) => (
        <div className="flex items-center gap-2">
          <StatusToggle
            checked={c.isActive}
            disabled={togglingId === c.id}
            onChange={() => handleToggleStatus(c)}
          />
          <span className={`text-[10px] font-bold ${c.isActive ? "text-green-600" : "text-[#71827d]"}`}>
            {c.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "Created",
      render: (c) => (
        <>
          <p className="text-[#304942] font-medium">{c.createdByAdmin?.name ?? "—"}</p>
          <p className="text-[#71827d]">{formatDateTime(c.createdAt)}</p>
        </>
      ),
    },
    {
      header: "Updated",
      render: (c) => (
        <>
          <p className="text-[#304942] font-medium">{c.updatedByAdmin?.name ?? "—"}</p>
          <p className="text-[#71827d]">{formatDateTime(c.updatedAt)}</p>
        </>
      ),
    },
    {
      header: "",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(c)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(c)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[18px] font-black text-[#16322c]">News Categories</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">
            Manage categories used to organize news. Slug is auto-generated from the name if left blank.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer text-[12px] font-bold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
        >
          + Add category
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
                {pagination.total} categor{pagination.total === 1 ? "y" : "ies"} total
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
          placeholder="Search by name or slug..."
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={categories}
          rowKey={(c) => c.id}
          loading={loading}
          error={error}
          loadingMessage="Loading news categories..."
          emptyMessage="No news categories found."
        />
        <Pagination
          pagination={pagination ?? null}
          onPageChange={setPage}
          variant="compact"
          itemLabel="categories"
          currentCount={categories.length}
        />
      </div>

      {modalOpen && (
        <NewsCategoryModal
          key={editingCategory ? `edit-${editingCategory.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          category={editingCategory}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete category?"
        itemName={pendingDelete?.name}
        message={
          pendingDelete && pendingDelete.newsCount > 0
            ? `${pendingDelete.newsCount} news(s) are linked to this category — deletion will be blocked until they're reassigned.`
            : undefined
        }
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}