// src/pages/newCars/Features/FeatureModal.tsx
import { useState } from "react";
import { useCreateFeatureMutation, useUpdateFeatureMutation, type FeatureRecord } from "./feature.api";
import { useGetFeatureCategoryOptionsQuery } from "../FeatureCategories/featureCategory.api";
import { extractApiError } from "../../../lib/apiClient";

interface FieldErrors {
  name?: string;
  categoryId?: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FeatureModal({
  open,
  onClose,
  feature,
}: {
  open: boolean;
  onClose: () => void;
  feature?: FeatureRecord | null;
}) {
  const isEditMode = !!feature;

  const [name, setName] = useState(feature ? feature.name : "");
  const [categoryId, setCategoryId] = useState<number | "">(feature?.categoryId ?? "");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  const { data: categories = [] } = useGetFeatureCategoryOptionsQuery();

  const [createFeature, { isLoading: creating }] = useCreateFeatureMutation();
  const [updateFeature, { isLoading: updating }] = useUpdateFeatureMutation();
  const saving = creating || updating;

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setErrors({});
    setServerError("");
  };

  if (!open) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!categoryId) next.categoryId = "Category is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      if (isEditMode && feature) {
        await updateFeature({
          id: feature.id,
          input: { name: name.trim(), categoryId: categoryId as number },
        }).unwrap();
      } else {
        await createFeature({ name: name.trim(), categoryId: categoryId as number }).unwrap();
      }
      resetForm();
      onClose();
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-[420px] bg-white border border-[#dce7e3] rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <h2 className="text-[#16322c] text-lg font-black">{isEditMode ? "Edit feature" : "Add feature"}</h2>
            <p className="text-[#71827d] text-xs mt-1">
              {isEditMode ? `Update details for ${feature?.name}` : "Add a new feature (e.g. Sunroof)."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="cursor-pointer text-[#96a6a1] hover:text-[#16322c] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5 space-y-4" noValidate>
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunroof"
              className="w-full text-sm font-medium text-[#16322c] bg-[#f3f7f5] border rounded-lg px-3 py-2.5 outline-none transition-all focus:bg-white"
              style={{
                borderColor: errors.name ? "#f0997b" : "#d6e3df",
                boxShadow: errors.name ? "0 0 0 2px rgba(216,90,48,0.1)" : "none",
              }}
            />
            {errors.name && <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.name}</p>}
          </Field>

          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
              className="cursor-pointer w-full text-sm font-medium text-[#16322c] bg-[#f3f7f5] border rounded-lg px-3 py-2.5 outline-none transition-all focus:bg-white"
              style={{
                borderColor: errors.categoryId ? "#f0997b" : "#d6e3df",
                boxShadow: errors.categoryId ? "0 0 0 2px rgba(216,90,48,0.1)" : "none",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.categoryId}</p>}
          </Field>

          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              <p className="text-red-500 text-xs font-medium">{serverError}</p>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-bold text-[#304942] border border-[#d6e3df] hover:bg-[#f3f7f5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
            >
              {saving ? "Saving..." : isEditMode ? "Save changes" : "Add feature"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
