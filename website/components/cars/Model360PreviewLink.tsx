"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { getCar360PreviewImages } from "@/lib/cars/car.api";
import { getModel360Path } from "@/lib/cars/car.urls";
import { getPublicUploadUrl } from "@/lib/home/home.api";

interface Model360PreviewLinkProps {
  brandSlug: string;
  modelSlug: string;
  title: string;
}

export default function Model360PreviewLink({ brandSlug, modelSlug, title }: Model360PreviewLinkProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    let disposed = false;
    let idleId: number | undefined;
    let fallbackTimer: number | undefined;
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const loadPreview = async () => {
      try {
        const data = await getCar360PreviewImages(brandSlug, modelSlug);
        const urls = data?.frames.map((frame) => getPublicUploadUrl(frame.imageUrl)).filter((url): url is string => Boolean(url)) ?? [];
        if (urls.length < 2) return;
        await Promise.all(urls.map((src) => new Promise<void>((resolve) => {
          const image = new window.Image();
          image.onload = image.onerror = () => resolve();
          image.src = src;
        })));
        if (!disposed) setFrames(urls);
      } catch {
        // The regular button remains available when the optional preview fails.
      }
    };

    const schedulePreview = () => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(() => void loadPreview(), { timeout: 3000 });
      } else {
        fallbackTimer = window.setTimeout(() => void loadPreview(), 1500);
      }
    };

    if (document.readyState === "complete") schedulePreview();
    else window.addEventListener("load", schedulePreview, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedulePreview);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
    };
  }, [brandSlug, modelSlug]);

  useEffect(() => {
    if (frames.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return;
    const timer = window.setInterval(() => setActiveFrame((current) => (current + 1) % frames.length), 180);
    return () => window.clearInterval(timer);
  }, [frames]);

  return <Link href={getModel360Path(brandSlug, modelSlug)} aria-label={`Open ${title} 360 degree view`} className="inline-flex h-11 min-w-[122px] items-center gap-2 overflow-hidden rounded-[5px] border border-[#7ea51a]/45 bg-[#f4ffd9]/80 px-2.5 text-[10px] font-semibold text-[#315548] dark:border-[#c9ff49]/25 dark:bg-[#c9ff49]/10 dark:text-[#dfff97]">
    {frames.length > 1 ? <span className="relative h-8 w-12 shrink-0 overflow-hidden rounded-[4px] bg-white/75 dark:bg-black/15"><Image src={frames[activeFrame]} alt="" fill unoptimized sizes="48px" className="object-contain p-0.5" /></span> : <span className="grid h-8 w-8 shrink-0 place-items-center"><RotateCw size={13} /></span>}
    <span className="whitespace-nowrap">360° view</span>
  </Link>;
}
