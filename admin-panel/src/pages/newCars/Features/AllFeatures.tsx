// src/pages/newCars/Features/AllFeatures.tsx
import { useEffect, useState } from "react";
import { useGetFeaturesQuery, useDeleteFeatureMutation, type FeatureRecord } from "./feature.api";
import { useGetFeatureCategoryOptionsQuery } from "../FeatureCategories/featureCategory.api";
import { extractApiError } from "../../../lib/apiClient";
import FeatureModal from "./FeatureModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput, FilterSelect } from "../../../components/common/SearchFilterBar";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function AllFeatures() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<number | "">("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories = [] } = useGetFeatureCategoryOptionsQuery();

  const {
    data: featureData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetFeaturesQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: filterCategoryId || undefined,
  });

  const features = featureData?.data ?? [];
  const pagination = featureData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureRecord | null>(null);

  const openAddModal = () => {
    setEditingFeature(null);
    setModalOpen(true);
  };

  const openEditModal = (f: FeatureRecord) => {
    setEditingFeature(f);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFeature(null);
  };

  const [deleteFeature] = useDeleteFeatureMutation();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<FeatureRecord | null>(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setBusyId(pendingDelete.id);
    try {
      await deleteFeature(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  const columns: DataTableColumn<FeatureRecord>[] = [
    {
      header: "Name",
      render: (f) => <p className="font-semibold text-[#16322c]">{f.name}</p>,
    },
    {
      header: "Category",
      render: (f) =>
        f.category ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#304942] bg-[#f3f7f5]">
            {f.category.name}
          </span>
        ) : (
          <span className="text-[#96a6a1]">Uncategorized</span>
        ),
    },
    {
      header: "",
      align: "right",
      render: (f) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(f)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(f)}
            disabled={busyId === f.id}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {busyId === f.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[18px] font-black text-[#16322c]">Features</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">
            Manage the master list of features (Sunroof, Cruise Control, ...) available to assign to variants.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer text-[12px] font-bold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
        >
          + Add feature
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
                {pagination.total} feature{pagination.total === 1 ? "" : "s"} total
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
        <FilterSelect
          value={filterCategoryId}
          onChange={(v) => {
            setFilterCategoryId(v ? Number(v) : "");
            setPage(1);
          }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="All categories"
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={features}
          rowKey={(f) => f.id}
          loading={loading}
          error={error}
          loadingMessage="Loading features..."
          emptyMessage="No features found."
        />
        <Pagination
          pagination={pagination ?? null}
          onPageChange={setPage}
          variant="compact"
          itemLabel="features"
          currentCount={features.length}
        />
      </div>

      {modalOpen && (
        <FeatureModal
          key={editingFeature ? `edit-${editingFeature.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          feature={editingFeature}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete feature?"
        itemName={pendingDelete?.name}
        loading={busyId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
