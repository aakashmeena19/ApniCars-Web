// src/pages/AdminUsers/Roles/RolePermissionsModal.tsx
//
// Read-only view of every permission assigned to a role — opened from the
// "View" button next to the Permissions count on the Roles listing page.

import { useMemo } from "react";
import { useGetPermissionsQuery } from "../Permission/permission.api";
import type { RoleRecord } from "./role.api";

const ACCENT = "#0B5A48";

// Colour-code by action so the chips are scannable at a glance instead of
// all looking the same. Falls back to a neutral style for unknown actions.
const ACTION_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  view: { bg: "#eef4ff", text: "#3457d5", dot: "#3457d5" },
  create: { bg: "#eafaf0", text: "#1f9d55", dot: "#1f9d55" },
  update: { bg: "#fff8e6", text: "#b8860b", dot: "#d4a017" },
  delete: { bg: "#fdeeec", text: "#c23a25", dot: "#D4300F" },
};
const DEFAULT_ACTION_STYLE = { bg: "#f3f7f5", text: "#304942", dot: "#71827d" };

function getActionStyle(action: string) {
  return ACTION_STYLES[action.toLowerCase()] ?? DEFAULT_ACTION_STYLE;
}

export default function RolePermissionsModal({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: RoleRecord | null;
}) {
  const { data: permsData, isLoading } = useGetPermissionsQuery();

  const assignedByModule = useMemo(() => {
    if (!permsData || !role) return {} as Record<string, { id: number; action: string }[]>;
    const assignedIds = new Set(role.permissionIds ?? []);
    const result: Record<string, { id: number; action: string }[]> = {};
    for (const p of permsData.flat) {
      if (!assignedIds.has(p.id)) continue;
      if (!result[p.module]) result[p.module] = [];
      result[p.module].push({ id: p.id, action: p.action });
    }
    return result;
  }, [permsData, role]);

  const moduleNames = Object.keys(assignedByModule).sort();
  const totalAssigned = role?.permissionIds?.length ?? 0;

  if (!open || !role) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[600px] bg-white border border-[#dce7e3] rounded-lg shadow-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-5 border-b border-[#e8efec]">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "#fdeeec" }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2">
                <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Z" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-[#16322c] text-lg font-black leading-tight">{role.roleName}</h2>
              <p className="text-[#71827d] text-xs mt-1">Permissions assigned to this role</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer shrink-0 text-[#96a6a1] hover:text-[#16322c] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          {isLoading ? (
            <p className="text-[12px] text-[#71827d] text-center py-8">Loading permissions...</p>
          ) : totalAssigned === 0 || moduleNames.length === 0 ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-11 h-11 rounded-full bg-[#f3f7f5] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#96a6a1" strokeWidth="2">
                  <path d="M12 2 4 6v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-4Z" strokeLinejoin="round" />
                  <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" strokeLinecap="round" />
                  <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[12.5px] font-semibold text-[#304942]">No permissions assigned</p>
              <p className="text-[11.5px] text-[#71827d] mt-1">Edit this role to assign permissions.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {moduleNames.map((mod) => (
                <div key={mod} className="border border-[#dce7e3] rounded-lg px-4 py-3 hover:border-[#d6e3df] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-bold text-[#16322c] capitalize">{mod}</p>
                    <span className="text-[10px] font-bold text-[#71827d] bg-[#f3f7f5] px-2 py-0.5 rounded-full">
                      {assignedByModule[mod].length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedByModule[mod].map((p) => {
                      const style = getActionStyle(p.action);
                      return (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
                          style={{ background: style.bg, color: style.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                          {p.action}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#e8efec] bg-[#f5f9f7]">
          <p className="text-[11px] text-[#71827d]">
            <span className="font-bold text-[#304942]">{totalAssigned}</span> permission
            {totalAssigned === 1 ? "" : "s"} across{" "}
            <span className="font-bold text-[#304942]">{moduleNames.length}</span> module
            {moduleNames.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold text-[#304942] border border-[#d6e3df] hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}