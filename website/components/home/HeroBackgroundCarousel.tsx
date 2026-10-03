"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeBanner } from "@/lib/home/home.types";

const fallbackMedia = [
  { id: -1, type: "image" as const, src: "/images/exec-2a7ef9b3-128e-4af4-b98e-729c104be27e.png" },
  { id: -2, type: "image" as const, src: "/images/hero-light-premium.png" },
];

export default function HeroBackgroundCarousel({ banners }: { banners: HomeBanner[] }) {
  const dynamicMedia = banners.flatMap((banner) => {
    const path = banner.mediaType === 2 ? banner.videoUrl : banner.imageUrl;
    const src = getPublicUploadUrl(path);
    return src ? [{ id: banner.id, type: banner.mediaType === 2 ? "video" as const : "image" as const, src }] : [];
  });
  const media = dynamicMedia.length > 0 ? dynamicMedia : fallbackMedia;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (media.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % media.length), 6500);
    return () => window.clearInterval(timer);
  }, [media.length]);

  return (
    <>
      <div className="absolute inset-0">
        {media.map((item, index) => item.type === "video" ? <video key={item.id} src={item.src} autoPlay muted loop playsInline className={`absolute inset-0 h-full w-full object-cover object-[64%_center] transition-opacity duration-1000 ${active === index ? "opacity-100" : "opacity-0"}`} /> : <Image key={item.id} src={item.src} alt="" fill priority={index === 0} sizes="100vw" className={`object-cover object-[64%_center] transition-opacity duration-1000 ${active === index ? "opacity-100" : "opacity-0"}`} />)}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,24,20,.87)_0%,rgba(4,24,20,.79)_27%,rgba(4,24,20,.32)_47%,rgba(4,24,20,.02)_76%)] dark:bg-[linear-gradient(90deg,rgba(4,24,20,.98)_0%,rgba(4,24,20,.93)_27%,rgba(4,24,20,.55)_47%,rgba(4,24,20,.12)_76%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061f1b]/45 to-transparent" />
      </div>
      {media.length > 1 && <div className="absolute right-5 top-5 z-20 flex gap-2 sm:right-8 sm:top-8">{media.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} aria-label={`Show banner ${index + 1}`} aria-pressed={active === index} className={`h-1.5 rounded-full transition-all ${active === index ? "w-7 bg-[#c9ff49]" : "w-1.5 bg-white/55 hover:bg-white"}`} />)}</div>}
    </>
  );
}

