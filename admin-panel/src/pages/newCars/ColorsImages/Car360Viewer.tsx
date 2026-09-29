import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconMaximize,
  IconMinimize,
  IconPlayerPause,
  IconPlayerPlay,
  IconRotate360,
} from "@tabler/icons-react";
import { getUploadUrl } from "../../../lib/apiClient";
import type { CarImageRecord } from "./image.api";

interface Car360ViewerProps {
  frames: CarImageRecord[];
  loading: boolean;
  error: string;
}

function frameNumber(frame: CarImageRecord) {
  const match = frame.angle?.match(/^frame-(\d+)$/);
  return match ? Number(match[1]) : frame.sortOrder;
}

export default function Car360Viewer({ frames, loading, error }: Car360ViewerProps) {
  const orderedFrames = useMemo(
    () => [...frames].sort((a, b) => frameNumber(a) - frameNumber(b)),
    [frames],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; index: number } | null>(null);

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [frames]);

  useEffect(() => {
    if (!playing || orderedFrames.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % orderedFrames.length),
      90,
    );
    return () => window.clearInterval(timer);
  }, [orderedFrames.length, playing]);

  useEffect(() => {
    setLoadedCount(0);
    let cancelled = false;
    let position = 0;

    const preloadBatch = () => {
      if (cancelled || position >= orderedFrames.length) return;
      const batch = orderedFrames.slice(position, position + 6);
      position += batch.length;
      Promise.all(
        batch.map(
          (frame) =>
            new Promise<void>((resolve) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => resolve();
              image.src = getUploadUrl(frame.imageUrl) ?? "";
            }),
        ),
      ).then(() => {
        if (cancelled) return;
        setLoadedCount(position);
        window.setTimeout(preloadBatch, 20);
      });
    };

    preloadBatch();
    return () => {
      cancelled = true;
    };
  }, [orderedFrames]);

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  const moveBy = (step: number) => {
    if (!orderedFrames.length) return;
    setIndex((current) => (current + step + orderedFrames.length) % orderedFrames.length);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    } else {
      viewerRef.current?.requestFullscreen().catch(() => undefined);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-[12px] text-[#71827d]">Loading 360 frames...</div>;
  }
  if (error) {
    return <div className="py-16 text-center text-[12px] font-medium text-[#D4300F]">{error}</div>;
  }
  if (!orderedFrames.length) {
    return (
      <div className="py-16 text-center">
        <IconRotate360 className="mx-auto text-[#96a6a1]" size={32} stroke={1.6} />
        <p className="mt-3 text-[12px] font-semibold text-[#50655f]">No 360 frames available for this model.</p>
      </div>
    );
  }

  const current = orderedFrames[Math.min(index, orderedFrames.length - 1)];
  const loadedPercent = Math.round((loadedCount / orderedFrames.length) * 100);

  return (
    <div
      ref={viewerRef}
      className="relative overflow-hidden border border-[#dce7e3] bg-white"
    >
      <div
        className={`relative flex touch-none select-none items-center justify-center bg-[#f3f7f5] ${
          isFullscreen ? "min-h-[calc(100vh-78px)]" : "min-h-[320px] sm:min-h-[430px]"
        }`}
        onPointerDown={(event) => {
          setPlaying(false);
          dragRef.current = { x: event.clientX, index };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current) return;
          const offset = Math.round((event.clientX - dragRef.current.x) / 7);
          const next = (dragRef.current.index - offset) % orderedFrames.length;
          setIndex(next < 0 ? next + orderedFrames.length : next);
        }}
        onPointerUp={() => {
          dragRef.current = null;
        }}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
      >
        <img
          src={getUploadUrl(current.imageUrl) ?? undefined}
          alt={current.caption ?? "360 degree car view"}
          draggable={false}
          className={isFullscreen ? "max-h-[calc(100vh-78px)] w-full object-contain" : "max-h-[430px] w-full object-contain"}
        />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md border border-white/70 bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
          <IconRotate360 size={17} className="text-[#0B5A48]" />
          <span className="text-[10px] font-bold text-[#304942]">Drag to rotate</span>
        </div>
        <span className="absolute bottom-3 right-3 rounded-md bg-[#16322c]/85 px-2 py-1 text-[10px] font-bold text-white">
          {index + 1} / {orderedFrames.length}
        </span>
      </div>

      <div className="border-t border-[#dce7e3] bg-white px-3 py-3 sm:px-4">
        <input
          type="range"
          min={0}
          max={orderedFrames.length - 1}
          value={index}
          onChange={(event) => {
            setPlaying(false);
            setIndex(Number(event.target.value));
          }}
          aria-label="360 frame"
          className="w-full cursor-pointer accent-[#0B5A48]"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => moveBy(-1)} title="Previous frame" aria-label="Previous frame" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5]">
              <IconArrowLeft size={16} />
            </button>
            <button type="button" onClick={() => setPlaying((value) => !value)} title={playing ? "Pause rotation" : "Play rotation"} aria-label={playing ? "Pause rotation" : "Play rotation"} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[#0B5A48] text-white hover:bg-[#0d6a54]">
              {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
            </button>
            <button type="button" onClick={() => moveBy(1)} title="Next frame" aria-label="Next frame" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5]">
              <IconArrowRight size={16} />
            </button>
          </div>

          <p className="text-[10px] font-semibold text-[#71827d]">Frames ready {loadedPercent}%</p>

          <button type="button" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#dce7e3] text-[#304942] hover:bg-[#f3f7f5]">
            {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
