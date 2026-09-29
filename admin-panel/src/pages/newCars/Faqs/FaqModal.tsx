// src/pages/newCars/Faqs/FaqModal.tsx
import { useRef, useState } from "react";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
  type FaqRecord,
} from "./faq.api";
import { useGetCarModelOptionsQuery } from "../carModels/carModel.api";
import { extractApiError } from "../../../lib/apiClient";

// Every field here is required, on both Add and Edit — no optional
// fields in this module (per explicit product requirement).
interface FieldErrors {
  modelId?: string;
  question?: string;
  answer?: string;
  displayOrder?: string;
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

const inputClass =
  "w-full text-sm font-medium text-[#16322c] bg-[#f3f7f5] border rounded-lg px-3 py-2.5 outline-none transition-all focus:bg-white";

export default function FaqModal({
  open,
  onClose,
  faq,
}: {
  open: boolean;
  onClose: () => void;
  // Present -> edit mode. Absent/null -> create mode.
  faq?: FaqRecord | null;
}) {
  const isEditMode = !!faq;

  const { data: carModels = [] } = useGetCarModelOptionsQuery();

  const [modelId, setModelId] = useState<number | "">(faq?.modelId ?? "");
  const [question, setQuestion] = useState(faq ? faq.question : "");
  const [answer, setAnswer] = useState(faq ? faq.answer : "");
  const [displayOrder, setDisplayOrder] = useState(faq ? String(faq.displayOrder) : "0");
  // No default — isActive must be an explicit, deliberate choice on
  // every save (same "all fields mandatory" rule as everything else here).
  const [isActive, setIsActive] = useState<boolean>(faq?.isActive ?? true);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const questionRef = useRef<HTMLInputElement>(null);

  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqMutation();
  const saving = creating || updating;

  const resetForm = () => {
    setModelId("");
    setQuestion("");
    setAnswer("");
    setDisplayOrder("0");
    setIsActive(true);
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
    if (!modelId) next.modelId = "Car model is required.";
    if (question.trim().length < 5) next.question = "Question must be at least 5 characters.";
    if (answer.trim().length < 2) next.answer = "Answer is required.";
    if (
      displayOrder === "" ||
      !Number.isInteger(Number(displayOrder)) ||
      Number(displayOrder) < 0
    ) {
      next.displayOrder = "Display order is required (0 or greater).";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    // validate() above already guarantees modelId is set — the cast here
    // just satisfies TypeScript.
    const payload = {
      modelId: Number(modelId),
      question: question.trim(),
      answer: answer.trim(),
      displayOrder: Number(displayOrder),
      isActive,
    };

    try {
      if (isEditMode && faq) {
        await updateFaq({ id: faq.id, input: payload }).unwrap();
      } else {
        await createFaq(payload).unwrap();
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
      <div className="w-full max-w-[560px] bg-white border border-[#dce7e3] rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <h2 className="text-[#16322c] text-lg font-black">
              {isEditMode ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <p className="text-[#71827d] text-xs mt-1">
              {isEditMode ? "Update this FAQ's details" : "All fields are required."}
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
          <Field label="Car model">
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value ? Number(e.target.value) : "")}
              className="cursor-pointer w-full text-sm font-medium text-[#16322c] bg-[#f3f7f5] border rounded-lg px-3 py-2.5 outline-none transition-all focus:bg-white"
              style={{ borderColor: errors.modelId ? "#f0997b" : "#d6e3df" }}
            >
              <option value="">Select a car model</option>
              {carModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brand.name} — {m.name}
                </option>
              ))}
            </select>
            {errors.modelId && <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.modelId}</p>}
          </Field>

          <Field label="Question">
            <input
              ref={questionRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the ground clearance?"
              className={inputClass}
              style={{
                borderColor: errors.question ? "#f0997b" : "#d6e3df",
                boxShadow: errors.question ? "0 0 0 2px rgba(216,90,48,0.1)" : "none",
              }}
            />
            {errors.question && (
              <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.question}</p>
            )}
          </Field>

          <Field label="Answer">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. The ground clearance is 205mm."
              rows={4}
              className={`${inputClass} resize-none`}
              style={{
                borderColor: errors.answer ? "#f0997b" : "#d6e3df",
                boxShadow: errors.answer ? "0 0 0 2px rgba(216,90,48,0.1)" : "none",
              }}
            />
            {errors.answer && <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.answer}</p>}
          </Field>

          <Field label="Display order">
            <input
              type="number"
              min={0}
              step="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              placeholder="e.g. 0"
              className={inputClass}
              style={{
                borderColor: errors.displayOrder ? "#f0997b" : "#d6e3df",
                boxShadow: errors.displayOrder ? "0 0 0 2px rgba(216,90,48,0.1)" : "none",
              }}
            />
            {errors.displayOrder && (
              <p className="text-[11px] font-medium text-[#D4300F] mt-1">{errors.displayOrder}</p>
            )}
          </Field>

          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0B5A48] cursor-pointer"
            />
            <span className="text-sm font-medium text-[#304942]">Active</span>
          </label>

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
              {saving ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving...
                </>
              ) : isEditMode ? (
                "Save changes"
              ) : (
                "Create FAQ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}