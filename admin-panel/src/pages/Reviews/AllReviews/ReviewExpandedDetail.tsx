// src/pages/Reviews/AllReviews/ReviewExpandedDetail.tsx
//
// Mounted only while its row is expanded (DataTable's renderExpanded is
// only invoked when isExpanded is true) — the detail query (replies +
// helpful-vote list, both unbounded) only ever fires on demand, never
// riding along with the main list.
import { useState } from "react";
import {
  useGetReviewByIdQuery,
  useCreateReviewReplyMutation,
  useDeleteReviewReplyMutation,
  type ReviewRecord,
} from "./review.api";
import { extractApiError, getUploadUrl } from "../../../lib/apiClient";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1">{label}</p>
    <div className="text-[12.5px] text-[#16322c]">{value}</div>
  </div>
);

export default function ReviewExpandedDetail({ review }: { review: ReviewRecord }) {
  const { data: detail, isLoading, error: queryError } = useGetReviewByIdQuery(review.id);
  const error = queryError ? "Couldn't load review detail." : "";

  const [replyBody, setReplyBody] = useState("");
  const [createReply, { isLoading: posting }] = useCreateReviewReplyMutation();
  const [deleteReply] = useDeleteReviewReplyMutation();
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);
  const [actionError, setActionError] = useState("");

  const handlePostReply = async () => {
    if (!replyBody.trim()) return;
    setActionError("");
    try {
      await createReply({ reviewId: review.id, body: replyBody.trim() }).unwrap();
      setReplyBody("");
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    setActionError("");
    setDeletingReplyId(replyId);
    try {
      await deleteReply({ replyId, reviewId: review.id }).unwrap();
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setDeletingReplyId(null);
    }
  };

  if (isLoading) {
    return <p className="text-[12px] text-[#71827d] py-2">Loading detail...</p>;
  }
  if (error || !detail) {
    return <p className="text-[12px] text-[#D4300F] py-2">{error}</p>;
  }

  return (
    <div className="space-y-4 text-[12px]">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
        <Field label="Ownership Duration" value={review.ownershipDuration ?? "—"} />
        <Field label="Km Driven" value={review.kmDriven != null ? review.kmDriven.toLocaleString("en-IN") : "—"} />
        <Field label="Variant" value={review.variant?.variantName ?? "—"} />
        <Field label="Helpful Votes" value={detail.helpfulVotes.length} />
      </div>

      {review.title && <Field label="Title" value={review.title} />}
      {review.body && <Field label="Full Review" value={<p className="whitespace-pre-wrap leading-relaxed">{review.body}</p>} />}

      {review.categoryScores.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">Category Scores</p>
          <div className="flex flex-wrap gap-2">
            {review.categoryScores.map((c) => (
              <span key={c.id} className="rounded-lg bg-[#f3f7f5] border border-[#dce7e3] px-2.5 py-1 text-[11px] font-semibold text-[#304942]">
                {c.category ?? "—"}: {c.score ?? "—"}
              </span>
            ))}
          </div>
        </div>
      )}

      {review.images.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">Photos</p>
          <div className="flex flex-wrap gap-2">
            {review.images.map((img) => (
              <a key={img.id} href={getUploadUrl(img.imageUrl) ?? undefined} target="_blank" rel="noreferrer">
                <img
                  src={getUploadUrl(img.imageUrl) ?? undefined}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover border border-[#dce7e3]"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {detail.helpfulVotes.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">
            Marked Helpful By ({detail.helpfulVotes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detail.helpfulVotes.map((v) => (
              <span key={v.id} className="rounded-full bg-[#f3f7f5] px-2.5 py-1 text-[11px] font-medium text-[#304942]">
                {v.user.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#71827d] mb-1.5">
          Replies ({detail.replies.length})
        </p>

        {actionError && <p className="text-[11px] font-medium text-[#D4300F] mb-2">{actionError}</p>}

        <div className="space-y-2 mb-3">
          {detail.replies.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-3 rounded-lg bg-[#f3f7f5] px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#16322c]">
                  {r.admin ? (
                    <span className="text-[#D4300F]">{r.admin.name} (Official Response)</span>
                  ) : (
                    r.user?.name ?? "Unknown"
                  )}
                  <span className="ml-2 font-medium text-[#71827d]">{formatDateTime(r.createdAt)}</span>
                </p>
                <p className="text-[12px] text-[#304942] mt-0.5 whitespace-pre-wrap">{r.body}</p>
              </div>
              <button
                onClick={() => handleDeleteReply(r.id)}
                disabled={deletingReplyId === r.id}
                className="cursor-pointer shrink-0 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {deletingReplyId === r.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
          {detail.replies.length === 0 && <p className="text-[11px] text-[#71827d]">No replies yet.</p>}
        </div>

        <div className="flex items-start gap-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Post an official reply as ApniCars..."
            rows={2}
            maxLength={2000}
            className="flex-1 text-[12px] text-[#16322c] bg-white border border-[#d6e3df] rounded-lg px-3 py-2 outline-none focus:border-[#0B5A48] resize-none"
          />
          <button
            onClick={handlePostReply}
            disabled={posting || !replyBody.trim()}
            className="cursor-pointer shrink-0 text-[11px] font-bold text-white px-3.5 py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
          >
            {posting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
