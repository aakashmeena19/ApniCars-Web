// src/pages/newCars/AttributeOptions/AllAttributeOptions.tsx
import { useEffect, useState } from "react";
import {
  useGetAttributeOptionsQuery,
  useDeleteAttributeOptionMutation,
  type AttributeOptionRecord,
  type AttributeOptionCategory,
} from "./attributeOption.api";
import { extractApiError } from "../../../lib/apiClient";
import AttributeOptionModal from "./AttributeOptionModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput, FilterSelect } from "../../../components/common/SearchFilterBar";

// Rows-per-page choices shown in the dropdown — same set as AllAdminLogs.tsx.
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Known categories shown as quick filter options — the underlying field
// is free text, so a brand-new category typed in the modal will simply
// not appear here until selected via search.
const KNOWN_CATEGORIES = ["transmission", "drivetrain"];

export default function AllAttributeOptions() {
  const [page, setPage] = useState(1);
  // Rows-per-page, user-controlled via a dropdown next to the filters.
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  // Debounced copy of `search` — this is what actually goes into the
  // query args, so we don't refetch on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: optionsData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetAttributeOptionsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    category: (filterCategory || undefined) as AttributeOptionCategory | undefined,
  });

  const options = optionsData?.data ?? [];
  const pagination = optionsData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  // Modal state — null option = "Add" mode, a record = "Edit" mode.
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<AttributeOptionRecord | null>(null);

  const openAddModal = () => {
    setEditingOption(null);
    setModalOpen(true);
  };

  const openEditModal = (option: AttributeOptionRecord) => {
    setEditingOption(option);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingOption(null);
  };

  const [deleteAttributeOption] = useDeleteAttributeOptionMutation();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Row pending delete confirmation — set on "Delete" click, cleared on
  // cancel/confirm. Drives the shared ConfirmDialog popup.
  const [pendingDelete, setPendingDelete] = useState<AttributeOptionRecord | null>(null);
  const [actionError, setActionError] = useState("");

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await deleteAttributeOption(pendingDelete.id).unwrap();
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

  const columns: DataTableColumn<AttributeOptionRecord>[] = [
    {
      header: "Category",
      render: (o) => (
        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f3f7f5] text-[#304942]">
          {o.category}
        </span>
      ),
    },
    {
      header: "Name",
      render: (o) => (
        <>
          <p className="font-semibold text-[#16322c]">{o.name}</p>
          <p className="text-[#71827d]">{o.slug}</p>
        </>
      ),
    },
    {
      header: "",
      align: "right",
      render: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(o)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(o)}
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
          <h1 className="text-[18px] font-black text-[#16322c]">Attribute Options</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">
            Manage shared lookup values (transmission, drivetrain, ...) used by variant &amp; powertrain forms.
            Slug is auto-generated from the name if left blank.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer text-[12px] font-bold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
        >
          + Add option
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
                {pagination.total} option{pagination.total === 1 ? "" : "s"} total
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
        <FilterSelect
          value={filterCategory}
          onChange={(v) => {
            setFilterCategory(v as string);
            setPage(1);
          }}
          options={KNOWN_CATEGORIES.map((c) => ({ value: c, label: c }))}
          placeholder="All categories"
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={options}
          rowKey={(o) => o.id}
          loading={loading}
          error={error}
          loadingMessage="Loading attribute options..."
          emptyMessage="No attribute options found."
        />
        <Pagination
          pagination={pagination ?? null}
          onPageChange={setPage}
          variant="compact"
          itemLabel="options"
          currentCount={options.length}
        />
      </div>

      {modalOpen && (
        <AttributeOptionModal
          key={editingOption ? `edit-${editingOption.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          defaultCategory={(filterCategory || undefined) as AttributeOptionCategory | undefined}
          option={editingOption}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete option?"
        itemName={pendingDelete?.name}
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}