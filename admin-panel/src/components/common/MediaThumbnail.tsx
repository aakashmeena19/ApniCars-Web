// src/components/common/MediaThumbnail.tsx
//
// Compact image/video preview for list tables.

export type MediaKind = "image" | "video";

export default function MediaThumbnail({ url, mediaType }: { url?: string; mediaType: MediaKind }) {
  return (
    <div className="flex items-center gap-2">
      {mediaType === "image" ? (
        <img src={url} alt="" className="w-9 h-9 rounded-lg object-cover border border-[#dce7e3]" />
      ) : (
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#dce7e3] bg-black">
          <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </div>
        </div>
      )}
      <span
        className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
        style={
          mediaType === "video"
            ? { background: "#fef2f0", color: "#D4300F" }
            : { background: "#eef6ff", color: "#1d72c4" }
        }
      >
        {mediaType}
      </span>
    </div>
  );
}
