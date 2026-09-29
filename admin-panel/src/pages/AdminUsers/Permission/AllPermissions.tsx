// src/pages/Permissions/AllPermissions.tsx

import { useState } from "react";
import { useGetPermissionsQuery, useDeletePermissionMutation } from "./permission.api";
import { extractApiError } from "../../../lib/apiClient";
import PermissionModal from "./PermissionModal";
import AdminPageHeader from "../../../components/common/AdminPageHeader";

export default function AllPermissions() {
  const {
    data: permsData,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetPermissionsQuery();

  const grouped = permsData?.grouped ?? {};
  const loading = isLoading || isFetching;
  const error = queryError ? (queryError as { message?: string }).message ?? "Something went wrong." : "";

  const [modalOpen, setModalOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  const [deletePermission] = useDeletePermissionMutation();

  const handleDelete = async (id: number) => {
    setActionError("");
    setDeletingId(id);
    try {
      await deletePermission(id).unwrap();
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const moduleNames = Object.keys(grouped).sort();

  return (
    <div className="space-y-5 max-w-[1100px] mx-auto">
      <AdminPageHeader
        title="Permissions"
        description="Define module actions that can be assigned to administrator roles."
        action={<button type="button" onClick={() => setModalOpen(true)} className="admin-primary-button cursor-pointer text-[12px] font-bold px-4 py-2.5 rounded-md">+ Add permission</button>}
      />

      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          <p className="text-red-500 text-xs font-medium">{actionError}</p>
        </div>
      )}

      <div className="admin-surface overflow-hidden">
        {loading && <p className="px-4 py-10 text-center text-[#71827d] text-[12px]">Loading permissions...</p>}
        {!loading && error && (
          <p className="px-4 py-10 text-center text-[#D4300F] text-[12px] font-medium">{error}</p>
        )}
        {!loading && !error && moduleNames.length === 0 && (
          <p className="px-4 py-10 text-center text-[#71827d] text-[12px]">
            No permissions yet. Click "+ Add permission" to get started.
          </p>
        )}

        {!loading &&
          !error &&
          moduleNames.map((mod, idx) => (
            <div key={mod} className={idx > 0 ? "border-t border-[#e8efec]" : ""}>
              <div className="px-4 py-3 bg-[#f3f7f5] border-b border-[#e8efec]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#50655f]">{mod}</p>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {grouped[mod].map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[#eaf5f0] text-[#0b5a48] px-2.5 py-1 rounded-md border border-[#cfe4dc]"
                  >
                    {p.action}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      aria-label={`Delete ${p.permissionKey}`}
                      className="cursor-pointer text-[#1d72c4]/60 hover:text-[#0B5A48] transition-colors disabled:opacity-50"
                    >
                      {deletingId === p.id ? "…" : "×"}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>

      <PermissionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
