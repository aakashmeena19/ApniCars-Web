// src/pages/newCars/FeatureCategories/AllFeatureCategories.tsx
import { useEffect, useState } from "react";
import {
  useGetFeatureCategoriesQuery,
  useDeleteFeatureCategoryMutation,
  type FeatureCategoryRecord,
} from "./featureCategory.api";
import { extractApiError } from "../../../lib/apiClient";
import FeatureCategoryModal from "./FeatureCategoryModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput } from "../../../components/common/SearchFilterBar";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function AllFeatureCategories() {
  const [page, setPage] = useState(1);
  // Categories are a small, bounded set in practice (a handful of
  // groups) — defaulting to a large page size means the whole list is
  // always in memory, which lets "Add category" suggest an accurate
  // next sort order below instead of guessing from a partial page.
  const [limit, setLimit] = useState(100);
  const [search, setSearch] = useState("");
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
  } = useGetFeatureCategoriesQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const categories = categoriesData?.data ?? [];
  const pagination = categoriesData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  // Suggested default for a new category's sort order — one past
  // whatever's currently highest, so categories don't all pile up at 0
  // if the admin doesn't think to change it.
  const nextSortOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.sortOrder)) + 1 : 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeatureCategoryRecord | null>(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: FeatureCategoryRecord) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const [deleteFeatureCategory] = useDeleteFeatureCategoryMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FeatureCategoryRecord | null>(null);
  const [actionError, setActionError] = useState("");

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await deleteFeatureCategory(pendingDelete.id).unwrap();
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

  const columns: DataTableColumn<FeatureCategoryRecord>[] = [
    {
      header: "Name",
      render: (c) => <p className="font-semibold text-[#16322c]">{c.name}</p>,
    },
    {
      header: "Sort order",
      render: (c) => <span className="text-[#50655f]">{c.sortOrder}</span>,
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
          <h1 className="text-[18px] font-black text-[#16322c]">Feature Categories</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">
            Manage groups (Safety, Comfort & Convenience, ...) used to organize features.
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
          placeholder="Search by name..."
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={categories}
          rowKey={(c) => c.id}
          loading={loading}
          error={error}
          loadingMessage="Loading categories..."
          emptyMessage="No feature categories found."
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
        <FeatureCategoryModal
          key={editingCategory ? `edit-${editingCategory.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          category={editingCategory}
          nextSortOrder={nextSortOrder}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete feature category?"
        itemName={pendingDelete?.name}
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
