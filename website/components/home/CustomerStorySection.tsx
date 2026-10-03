"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { HomeTestimonial } from "@/lib/home/home.types";

export default function CustomerStorySection({ stories }: { stories: HomeTestimonial[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (stories.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % stories.length), 5200);
    return () => window.clearInterval(timer);
  }, [stories.length]);
  if (stories.length === 0) return null;
  const story = stories[active] ?? stories[0];
  const rating = Math.max(0, Math.min(5, Math.round(Number(story.rating) || 0)));
  return <section className="bg-[#edf3f0] py-12 text-white dark:bg-[#061f1b] sm:py-14"><div className="page-shell relative min-h-[250px] overflow-hidden rounded-[8px] border border-white/10"><Image src="/images/exec-3a5c5bd7-c1f1-4f1e-84e1-ca6aa7590dfe.png" alt="" fill sizes="100vw" className="object-cover opacity-70 dark:opacity-60" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,29,25,.12)_0%,rgba(5,29,25,.41)_48%,rgba(5,29,25,.93)_76%)]" /><div className="relative z-10 grid min-h-[250px] items-center gap-8 px-6 py-9 sm:px-9 lg:grid-cols-[1.2fr_.8fr] lg:px-11"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#bad4cc]">Customer stories</p><h2 className="mt-2 text-[26px] font-semibold sm:text-[30px]">A clearer way to choose</h2></div><div className="max-w-[440px]"><figure key={story.id}><Quote size={22} className="text-[#c9ff49]" /><blockquote className="mt-3 min-h-[72px] text-[12px] leading-6 text-white/85">{story.quote}</blockquote><figcaption className="mt-5 flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold">{story.customerName}</p><p className="mt-1 text-[9px] text-white/55">{story.customerCity || "Verified car buyer"}</p></div><div className="flex gap-0.5 text-[#c9ff49]">{Array.from({ length: rating }).map((_, index) => <Star key={index} size={12} fill="currentColor" />)}</div></figcaption></figure><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><div className="flex gap-1.5">{stories.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} aria-label={`Show testimonial ${index + 1}`} className={`h-1.5 rounded-full ${active === index ? "w-6 bg-[#c9ff49]" : "w-1.5 bg-white/35"}`} />)}</div>{stories.length > 1 && <div className="flex gap-2"><button type="button" onClick={() => setActive((active - 1 + stories.length) % stories.length)} aria-label="Previous testimonial" className="grid h-8 w-8 place-items-center rounded-full border border-white/20"><ChevronLeft size={15} /></button><button type="button" onClick={() => setActive((active + 1) % stories.length)} aria-label="Next testimonial" className="grid h-8 w-8 place-items-center rounded-full border border-white/20"><ChevronRight size={15} /></button></div>}</div></div></div></div></section>;
}

