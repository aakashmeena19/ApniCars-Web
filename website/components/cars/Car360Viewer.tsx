"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play, RotateCw } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import { getModelPath } from "@/lib/cars/car.urls";
import type { Car360ImagesResult } from "@/lib/cars/car.types";

export default function Car360Viewer({ data }: { data: Car360ImagesResult }) {
  const frames = useMemo(() => data.frames.map((frame) => getPublicUploadUrl(frame.imageUrl)).filter((url): url is string => Boolean(url)), [data.frames]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [playing, setPlaying] = useState(true);
  const dragStart = useRef<{ x: number; frame: number } | null>(null);
  const title = `${data.brand.name} ${data.name}`;

  const move = useCallback((step: number) => {
    setFrameIndex((current) => (current + step + frames.length) % frames.length);
  }, [frames.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduceMotionTimer = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? window.setTimeout(() => setPlaying(false), 0)
      : undefined;
    const loaders = frames.map((src) => {
      const image = new window.Image();
      image.onload = image.onerror = () => setLoaded((count) => Math.min(count + 1, frames.length));
      image.src = src;
      return image;
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      if (reduceMotionTimer !== undefined) window.clearTimeout(reduceMotionTimer);
      loaders.forEach((image) => { image.onload = null; image.onerror = null; });
    };
  }, [frames]);

  useEffect(() => {
    if (!playing || frames.length < 2 || loaded < frames.length) return;
    const timer = window.setInterval(() => move(1), 110);
    return () => window.clearInterval(timer);
  }, [frames.length, loaded, move, playing]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") { setPlaying(false); move(-1); }
      if (event.key === "ArrowRight") { setPlaying(false); move(1); }
      if (event.key === " ") { event.preventDefault(); setPlaying((current) => !current); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  return <main className="fixed inset-x-0 bottom-0 top-[86px] z-[45] overflow-hidden bg-[#e8eeeb] text-[#10231b] dark:bg-[#061813] dark:text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(255,255,255,.95),rgba(229,237,233,.6)_40%,rgba(207,221,214,.8)_100%)] dark:bg-[radial-gradient(circle_at_60%_45%,rgba(31,70,58,.9),rgba(9,32,25,.9)_46%,rgba(4,19,15,1)_100%)]" />
    <div className="absolute inset-x-0 top-[15%] overflow-hidden opacity-[0.055] dark:opacity-[0.07]"><p className="whitespace-nowrap text-center text-[15vw] font-semibold uppercase leading-none">{data.name} 360°</p></div>
    <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/[0.08] px-4 py-3 dark:border-white/10 sm:px-7">
        <div className="flex min-w-0 items-center gap-3"><Link href={getModelPath(data.brand.slug, data.slug)} aria-label={`Back to ${title}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5"><ArrowLeft size={16} /></Link><div className="min-w-0"><p className="truncate text-[12px] font-semibold">{title}</p><p className="text-[9px] text-[#6f7e77] dark:text-white/45">Interactive exterior view</p></div></div>
        <div className="flex items-center gap-2 text-[9px] font-semibold text-[#49655a] dark:text-[#dfff97]"><RotateCw size={14} /> Drag to rotate</div>
      </div>

      <div className="relative min-h-0 flex-1 touch-none select-none" onPointerDown={(event) => { dragStart.current = { x: event.clientX, frame: frameIndex }; setPlaying(false); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (!dragStart.current) return; const delta = Math.round((event.clientX - dragStart.current.x) / 12); setFrameIndex((dragStart.current.frame - delta + frames.length * 10) % frames.length); }} onPointerUp={() => { dragStart.current = null; }} onPointerCancel={() => { dragStart.current = null; }}>
        <Image src={frames[frameIndex]} alt={`${title} 360 degree view`} fill priority unoptimized draggable={false} sizes="100vw" className="object-contain px-3 py-8 drop-shadow-[0_28px_22px_rgba(8,32,24,.22)] sm:px-[8vw]" />
        {loaded < frames.length && <div className="absolute inset-x-0 bottom-5 mx-auto w-56"><div className="h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"><span className="block h-full bg-[#9dcc28] transition-[width]" style={{ width: `${Math.round((loaded / frames.length) * 100)}%` }} /></div><p className="mt-2 text-center text-[9px] text-[#65766e] dark:text-white/45">Loading view {loaded}/{frames.length}</p></div>}
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-black/[0.08] bg-white/55 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-black/15"><button type="button" onClick={() => { setPlaying(false); move(-1); }} aria-label="Previous angle" className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-white/5"><ChevronLeft size={17} /></button><button type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? "Pause rotation" : "Play rotation"} className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-full bg-[#173d31] px-5 text-[10px] font-semibold text-white dark:bg-[#c9ff49] dark:text-[#10231b]">{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? "Pause" : "Auto rotate"}</button><button type="button" onClick={() => { setPlaying(false); move(1); }} aria-label="Next angle" className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-white/5"><ChevronRight size={17} /></button><span className="ml-2 hidden text-[9px] tabular-nums text-[#65766e] dark:text-white/45 sm:block">{frameIndex + 1} / {frames.length}</span></div>
    </div>
  </main>;
}
