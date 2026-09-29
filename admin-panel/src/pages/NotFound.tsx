// src/pages/NotFound.tsx
// Path: front/src/pages/NotFound.tsx
//
// Usage in App.tsx:
//   import NotFound from "./pages/NotFound";
//   ...
//   <Route path="*" element={<NotFound />} />   // replace the current
//   `<Navigate to="/dashboard" replace />` catch-all with this

import { Link, useNavigate } from "react-router-dom";

const ACCENT = "#0B5A48";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f3f7f5] px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-lg flex items-center justify-center"
          style={{ background: "#fef2f0" }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
          </svg>
        </div>

        {/* 404 code */}
        <p
          className="text-[64px] font-black leading-none tracking-tight"
          style={{ color: ACCENT }}
        >
          404
        </p>

        <h1 className="mt-2 text-[18px] font-black text-[#16322c]">
          Page not found
        </h1>
        <p className="mt-1.5 text-[13px] text-[#50655f] leading-relaxed">
          The page you're looking for doesn't exist, was moved, or you
          don't have access to it.
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-2.5">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer text-[12.5px] font-semibold px-4 py-2 rounded-lg border border-[#dce7e3] text-[#304942] bg-white hover:bg-[#e8efec] transition-colors"
          >
            Go back
          </button>
          <Link
            to="/dashboard"
            className="text-[12.5px] font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0a4a3c 0%, #0d6a54 58%, #118166 100%)" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}