"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, GitCompareArrows, Sparkles } from "lucide-react";
import type { CarVariantOption } from "@/lib/cars/car.types";
import { getVariantPath } from "@/lib/cars/car.urls";
import { formatPrice } from "@/lib/home/home.format";

const PAGE_SIZE = 6;

export default function ModelVariantList({ variants, brandSlug, modelSlug }: { variants: CarVariantOption[]; brandSlug: string; modelSlug: string }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = variants.slice(0, visible);
  return <div>
    <div className="grid gap-3">{shown.map((variant, index) => <article key={variant.id} className="group grid gap-4 rounded-[8px] border border-black/[0.08] bg-white p-4 transition hover:border-[#92aa86] hover:shadow-[0_12px_28px_rgba(8,31,25,.07)] dark:border-white/10 dark:bg-[#102720] sm:grid-cols-[52px_minmax(0,1fr)_150px_130px] sm:items-center">
      <div className="grid h-11 w-11 place-items-center rounded-[6px] bg-[#edf3ef] text-[11px] font-semibold text-[#315548] dark:bg-white/5 dark:text-[#c9ff49]">{String(index + 1).padStart(2, "0")}</div>
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-[13px] font-semibold">{variant.variantName}</h3>{variant.isTopSeller && <span className="inline-flex items-center gap-1 rounded-full bg-[#c9ff49] px-2 py-1 text-[8px] font-semibold text-[#173127]"><Sparkles size={9} /> Popular</span>}</div><p className="mt-1.5 text-[9px] text-[#74827c] dark:text-white/40">Complete price, features and technical details</p></div>
      <div><p className="text-[9px] text-[#7b8882] dark:text-white/38">Ex-showroom</p><strong className="mt-1 block text-[13px] font-semibold">{formatPrice(variant.price)}</strong></div>
      <div className="flex gap-2"><button type="button" aria-label={`Compare ${variant.variantName}`} className="grid h-9 w-9 place-items-center rounded-[5px] border border-black/10 text-[#426158] dark:border-white/15 dark:text-white"><GitCompareArrows size={13} /></button>{variant.slug && <Link href={getVariantPath(brandSlug, modelSlug, variant.slug)} className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#173d31] px-3 text-[9px] font-semibold text-white">Details <ArrowRight size={11} /></Link>}</div>
    </article>)}</div>
    {visible < variants.length && <div className="mt-5 text-center"><button type="button" onClick={() => setVisible((count) => Math.min(count + PAGE_SIZE, variants.length))} className="inline-flex min-h-10 items-center gap-2 rounded-[6px] border border-[#315548] px-5 text-[10px] font-semibold text-[#315548] dark:border-white/30 dark:text-white">Load more variants <ChevronDown size={13} /><span className="text-[#819087]">{variants.length - visible}</span></button></div>}
  </div>;
}
