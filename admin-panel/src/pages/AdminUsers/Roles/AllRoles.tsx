// src/pages/Roles/AllRoles.tsx

import { useState } from "react";
import { useGetRolesQuery, useDeleteRoleMutation, type RoleRecord } from "./role.api";
import { extractApiError } from "../../../lib/apiClient";
import RoleModal from "./RoleModal";
import RolePermissionsModal from "./RolePermissionsModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import DataTable, { type DataTableColumn } from "../../../components/common/DataTable";
import AdminPageHeader from "../../../components/common/AdminPageHeader";

export default function AllRoles() {
  const {
    data: rolesData,
    isLoading: rolesLoading,
    isFetching: rolesFetching,
    error: rolesQueryError,
  } = useGetRolesQuery();

  const roles = rolesData?.all ?? [];
  const loading = rolesLoading || rolesFetching;
  const error = rolesQueryError
    ? (rolesQueryError as { message?: string }).message ?? "Something went wrong."
    : "";

  // Modal state — null role = "Add" mode, a record = "Edit" mode.
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);

  const openAddModal = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const openEditModal = (role: RoleRecord) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRole(null);
  };

  // View-permissions modal — separate from the Add/Edit modal above.
  const [viewingRole, setViewingRole] = useState<RoleRecord | null>(null);

  const [deleteRole] = useDeleteRoleMutation();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RoleRecord | null>(null);
  const [actionError, setActionError] = useState("");

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setActionError("");
    setDeletingId(pendingDelete.id);
    try {
      await deleteRole(pendingDelete.id).unwrap();
      setPendingDelete(null);
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const columns: DataTableColumn<RoleRecord>[] = [
    { header: "Role", render: (r) => <span className="font-semibold text-[#16322c]">{r.roleName}</span> },
    {
      header: "Parent",
      render: (r) => (
        <span className="text-[#50655f]">
          {r.parentRole ? r.parentRole.roleName : <span className="text-[#96a6a1]">—</span>}
        </span>
      ),
    },
    {
      header: "Permissions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-[#50655f]">{r.permissionIds?.length ?? 0} assigned</span>
          <button
            onClick={() => setViewingRole(r)}
            className="cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            View
          </button>
        </div>
      ),
    },
    {
      header: "Created",
      render: (r) => (
        <span className="text-[#71827d]">
          {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(r)}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5] transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setPendingDelete(r)}
            disabled={deletingId === r.id}
            className="cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {deletingId === r.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 max-w-[1200px] mx-auto">
      <AdminPageHeader
        title="Roles"
        description="Build clear access levels by grouping permissions and optional parent roles."
        action={<button type="button" onClick={openAddModal} className="admin-primary-button cursor-pointer text-[12px] font-bold px-4 py-2.5 rounded-md">+ Add role</button>}
      />

      {actionError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
          <p className="text-red-500 text-xs font-medium">{actionError}</p>
        </div>
      )}

      <div className="admin-surface overflow-hidden">
        <DataTable
          columns={columns}
          rows={roles}
          rowKey={(r) => r.id}
          loading={loading}
          error={error}
          loadingMessage="Loading roles..."
          emptyMessage="No roles created yet."
        />
      </div>

      {modalOpen && (
        <RoleModal
          key={editingRole ? `edit-${editingRole.id}` : "add"}
          open={modalOpen}
          onClose={closeModal}
          role={editingRole}
        />
      )}

      <RolePermissionsModal
        open={!!viewingRole}
        onClose={() => setViewingRole(null)}
        role={viewingRole}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete role?"
        itemName={pendingDelete?.roleName}
        loading={deletingId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
