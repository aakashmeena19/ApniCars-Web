// src/components/common/BulkImageUploader.tsx
//
// Pick multiple image files at once, preview them, and upload all of
// them in a single API call via useCreateImagesBulkMutation. Scoping
// (modelId + optional colorId/angle) is fixed by the parent —
// this widget only handles file selection + the upload action itself.

import { useRef, useState } from "react";
import { useCreateImagesBulkMutation, type CarImageAngle } from "../../pages/newCars/ColorsImages/image.api";
import { extractApiError } from "../../lib/apiClient";

const MAX_FILES = 20;

interface PendingFile {
  file: File;
  previewUrl: string;
}

export default function BulkImageUploader({
  modelId,
  colorId,
  angle,
  onDone,
}: {
  modelId: number;
  colorId?: number;
  angle?: CarImageAngle;
  // Called after a successful upload (e.g. so the parent can collapse
  // the picker / show the newly-added images).
  onDone?: () => void;
}) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createImagesBulk, { isLoading: uploading }] = useCreateImagesBulkMutation();

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    const incoming = Array.from(files).slice(0, MAX_FILES - pending.length);
    if (incoming.length < files.length) {
      setError(`Only ${MAX_FILES} images can be uploaded at once — some files were skipped.`);
    }
    setPending((prev) => [
      ...prev,
      ...incoming.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setPending((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAll = () => {
    pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPending([]);
    setError("");
  };

  const handleUpload = async () => {
    if (pending.length === 0) return;
    setError("");
    try {
      await createImagesBulk({
        modelId,
        colorId,
        angle,
        images: pending.map((p) => p.file),
      }).unwrap();
      clearAll();
      onDone?.();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          addFiles(e.dataTransfer.files);
        }}
        className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-[#d6e3df] rounded-lg px-4 py-5 text-center hover:border-[#0B5A48] hover:bg-[#f7fbf9] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71827d" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-[12px] font-semibold text-[#304942]">
          Click or drag images here — up to {MAX_FILES} at once (JPG, PNG, WEBP, AVIF, 2MB each)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {pending.length > 0 && (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {pending.map((p, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#dce7e3] group">
                <img src={p.previewUrl} alt={`Selected ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label="Remove"
                  className="cursor-pointer absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="cursor-pointer text-[12px] font-bold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
            >
              {uploading ? "Uploading..." : `Upload ${pending.length} image${pending.length > 1 ? "s" : ""}`}
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={uploading}
              className="cursor-pointer text-[12px] font-bold px-3 py-2 rounded-lg border border-[#d6e3df] text-[#304942] hover:bg-[#f3f7f5] transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </>
      )}

      {error && <p className="text-[11px] font-medium text-[#D4300F]">{error}</p>}
    </div>
  );
}
