// src/components/common/PromptDialog.tsx
//
// Styled replacement for window.prompt() — for anywhere a short reason/
// note needs to be collected before confirming an action (e.g.
// rejecting a testimonial). Same visual language as ConfirmDialog.tsx.
import { useEffect, useState } from "react";

interface PromptDialogProps {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (value: string) => void | Promise<void>;
}

export default function PromptDialog({
  open,
  title,
  label,
  placeholder,
  confirmLabel = "Confirm",
  loading = false,
  onCancel,
  onConfirm,
}: PromptDialogProps) {
  const [value, setValue] = useState("");

  // Reset the field every time the dialog is (re)opened for a new item.
  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  const canConfirm = value.trim().length > 0 && !loading;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(value.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="w-full max-w-[420px] bg-white border border-[#dce7e3] rounded-lg shadow-xl p-6">
        <h2 className="text-[#16322c] text-base font-black">{title}</h2>

        <div className="mt-4">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">
            {label}
          </label>
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleConfirm();
              }
            }}
            placeholder={placeholder}
            rows={3}
            maxLength={255}
            className="w-full text-sm font-medium text-[#16322c] bg-[#f3f7f5] border border-[#d6e3df] rounded-lg px-3 py-2.5 outline-none transition-all focus:bg-white resize-none"
          />
        </div>

        <div className="flex items-center gap-2.5 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-bold text-[#304942] border border-[#d6e3df] hover:bg-[#f3f7f5] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
