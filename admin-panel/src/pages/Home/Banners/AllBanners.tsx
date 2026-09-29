// src/pages/Home/Banners/AllBanners.tsx
import { useEffect, useState } from "react";
import {
  useGetBannersQuery,
  useUpdateBannerStatusMutation,
  useDeleteBannerMutation,
  type BannerRecord,
} from "./banner.api";
import { getBannerMediaTypeLabel } from "../../../lib/lookups";
import { extractApiError, getUploadUrl } from "../../../lib/apiClient";
import BannerModal from "./BannerModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import { SearchFilterBar, SearchInput, FilterSelect } from "../../../components/common/SearchFilterBar";

const ACCENT = "#0B5A48";
// Rows-per-page choices shown in the dropdown — same set as AllOffers.tsx.
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const STATUS_OPTIONS: { value: "true" | "false"; label: string }[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SpecItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-wider text-[#71827d]">{label}</p>
      <p className="text-[#16322c] font-medium mt-0.5 break-words">{value}</p>
    </div>
  );
}

// Row detail shown only when a row is expanded — keeps the main table
// compact (no horizontal scroll) while still surfacing every field.
// Same pattern as AllFeatures.tsx's ExpandedFeatureDetail.
function ExpandedBannerDetail({ b }: { b: BannerRecord }) {
  const mediaUrl = getUploadUrl(b.imageUrl ?? b.videoUrl);

  return (
    <div className="space-y-4">
      {mediaUrl && (
        <div className="w-full max-w-[420px] rounded-lg overflow-hidden border border-[#dce7e3] bg-black">
          {b.mediaType === 1 ? (
            <img src={mediaUrl} alt={b.heading} className="w-full h-auto" />
          ) : (
            <video src={mediaUrl} className="w-full h-auto" controls playsInline />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
        <SpecItem label="CTA text" value={b.ctaText} />
        <SpecItem
          label="CTA link"
          value={
            <a href={b.ctaLink} target="_blank" rel="noreferrer" className="text-[#D4300F] hover:underline break-all">
              {b.ctaLink}
            </a>
          }
        />
        <SpecItem label="Created by" value={`${b.createdByAdmin.name} · ${formatDateTime(b.createdAt)}`} />
        <SpecItem
          label="Last updated by"
          value={b.updatedByAdmin ? `${b.updatedByAdmin.name} · ${formatDateTime(b.updatedAt)}` : "—"}
        />
        <SpecItem label="Highlight text" value={b.highlightText} />
        <SpecItem label="Description" value={b.description} />
      </div>
    </div>
  );
}

// Small pill-style toggle switch — same pattern as AllOffers.tsx's StatusToggle.
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
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
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

export default function AllBanners() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"true" | "false" | "">("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: bannersData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetBannersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: filterStatus === "" ? undefined : filterStatus === "true",
  });

  const banners = bannersData?.data ?? [];
  const pagination = bannersData?.pagination;
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerRecord | null>(null);

  const openAddModal = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEditModal = (banner: BannerRecord) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
  };

  const [updateBannerStatus] = useUpdateBannerStatusMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BannerRecord | null>(null);
  const [actionError, setActionError] = useState("");

  const handleToggleStatus = async (banner: BannerRecord) => {
    setActionError("");
    setTogglingId(banner.id);
    try {
      await updateBannerStatus({ id: banner.id, isActive: !banner.isActive }).unwrap();
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
      await deleteBanner(pendingDelete.id).unwrap();
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

  const columns: DataTableColumn<BannerRecord>[] = [
    {
      header: "Media",
      render: (b) => {
        const url = getUploadUrl(b.imageUrl ?? b.videoUrl);
        if (!url) return <div className="w-9 h-9 rounded-lg bg-[#f3f7f5] border border-[#dce7e3]" />;
        return b.mediaType === 1 ? (
          <img src={url} alt="" className="w-9 h-9 rounded-lg object-cover border border-[#dce7e3]" />
        ) : (
          <video
            src={url}
            className="w-9 h-9 rounded-lg object-cover border border-[#dce7e3]"
            autoPlay
            loop
            muted
            playsInline
          />
        );
      },
    },
    {
      header: "Banner",
      render: (b) => (
        <>
          <p className="font-semibold text-[#16322c]">{b.heading}</p>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f3f7f5] text-[#304942] uppercase">
            {getBannerMediaTypeLabel(b.mediaType)}
          </span>
        </>
      ),
    },
    { header: "Tag", render: (b) => <span className="text-[#50655f]">{b.tagLabel}</span> },
    { header: "Order", render: (b) => <span className="text-[#50655f]">{b.displayOrder}</span> },
    { header: "Clicks", render: (b) => <span className="text-[#50655f]">{b.clickCount}</span> },
    {
      header: "Status",
      render: (b) => (
        <div className="flex items-center gap-2">
          <StatusToggle
            checked={b.isActive}
            disabled={togglingId === b.id}
            onChange={() => handleToggleStatus(b)}
          />
          <span className={`text-[10px] font-bold ${b.isActive ? "text-green-600" : "text-[#71827d]"}`}>
            {b.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "",
      align: "right",
      render: (b) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEditModal(b)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(b)}
            disabled={deletingId === b.id}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deletingId === b.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[18px] font-black text-[#16322c]">Home Banners</h1>
          <p className="text-[12px] text-[#71827d] mt-0.5">Manage the homepage hero banners (image or video).</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="cursor-pointer text-[12px] font-bold text-white px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
        >
          + Add banner
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
                {pagination.total} banner{pagination.total === 1 ? "" : "s"} total
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
          placeholder="Search by name or heading..."
        />
        <FilterSelect
          value={filterStatus}
          onChange={(v) => {
            setFilterStatus((v as "true" | "false") || "");
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          placeholder="All statuses"
        />
      </SearchFilterBar>

      <div className="bg-white border border-[#dce7e3] rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={banners}
          rowKey={(b) => b.id}
          loading={loading}
          error={error}
          loadingMessage="Loading banners..."
          emptyMessage="No banners found."
          expandable
          renderExpanded={(b) => <ExpandedBannerDetail b={b} />}
        />
        <Pagination
          pagination={pagination ?? null}
          onPageChange={setPage}
          variant="compact"
          itemLabel="banners"
          currentCount={banners.length}
        />
      </div>

      {modalOpen && (
        <BannerModal
          key={editingBanner ? `edit-${editingBanner.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          banner={editingBanner}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete banner?"
        itemName={pendingDelete?.heading ?? undefined}
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
