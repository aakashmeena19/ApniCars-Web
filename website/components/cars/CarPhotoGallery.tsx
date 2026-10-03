"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images, Maximize2, Palette, X } from "lucide-react";
import type { CarColor, CarImage } from "@/lib/cars/car.types";
import { getPublicUploadUrl } from "@/lib/home/home.api";

type Props = {
  initialImages: CarImage[];
  categories: string[];
  initialTotal: number;
  colors: CarColor[];
  brandSlug: string;
  modelSlug: string;
  carName: string;
};

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/public/v1";

export default function CarPhotoGallery({ initialImages, categories, initialTotal, colors, brandSlug, modelSlug, carName }: Props) {
  const [images, setImages] = useState(initialImages);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : images[openIndex];
  const move = (step: number) => setOpenIndex((current) => current === null ? null : (current + step + images.length) % images.length);

  async function fetchPage(nextPage: number, nextCategory: string, append: boolean) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(nextPage), limit: "24" });
      if (nextCategory !== "All") params.set("category", nextCategory);
      const response = await fetch(`${PUBLIC_API_BASE_URL}/cars/${encodeURIComponent(brandSlug)}/${encodeURIComponent(modelSlug)}/images?${params.toString()}`);
      if (!response.ok) return;
      const payload = await response.json() as { success: boolean; data: { images: CarImage[]; pagination: { total: number } } };
      if (!payload.success) return;
      setImages((current) => append ? [...current, ...payload.data.images] : payload.data.images);
      setTotal(payload.data.pagination.total);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  function selectCategory(nextCategory: string) {
    if (nextCategory === category || loading) return;
    setCategory(nextCategory);
    setOpenIndex(null);
    void fetchPage(1, nextCategory, false);
  }

  const featured = images.slice(0, 5);
  const remaining = images.slice(5);

  return <>
    {featured.length > 0 && <section className="grid min-h-[520px] gap-2 lg:grid-cols-[1.35fr_.65fr]">
      <button type="button" onClick={() => setOpenIndex(0)} className="group relative min-h-[360px] overflow-hidden rounded-[8px] bg-[#dfe7e2] text-left lg:min-h-[520px]"><Image src={getPublicUploadUrl(featured[0].imageUrl)!} alt={featured[0].caption ?? carName} fill priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-20 text-white"><p className="text-[9px] font-semibold text-[#c9ff49]">Featured view</p><h2 className="mt-1 text-[20px] font-semibold normal-case">{featured[0].caption ?? featured[0].angle ?? `${carName} exterior`}</h2></div></button>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:grid-rows-4">{featured.slice(1).map((image, index) => <button key={image.id} type="button" onClick={() => setOpenIndex(index + 1)} className="group relative min-h-32 overflow-hidden rounded-[7px] bg-[#dfe7e2] text-left"><Image src={getPublicUploadUrl(image.imageUrl)!} alt={image.caption ?? carName} fill sizes="(max-width: 1024px) 50vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-3 py-2 text-[8px] font-semibold text-white">{image.caption ?? image.angle ?? "View"}</span></button>)}</div>
    </section>}

    <section className="sticky top-[72px] z-30 -mx-4 mt-8 border-y border-black/[0.08] bg-[#f4f7f5]/95 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#071813]/95 sm:mx-0 sm:rounded-[7px] sm:border sm:bg-white/95 dark:sm:bg-[#102720]/95"><div className="flex items-center gap-3"><div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{["All", ...categories].map((item) => <button key={item} type="button" onClick={() => selectCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-[9px] font-semibold ${item === category ? "bg-[#173d31] text-white" : "border border-black/[0.09] bg-white text-[#607168] dark:border-white/10 dark:bg-[#102720] dark:text-white/55"}`}>{item}</button>)}</div><span className="hidden shrink-0 items-center gap-2 border-l border-black/10 pl-4 text-[9px] text-[#607168] dark:border-white/10 dark:text-white/48 sm:flex"><Images size={13} />{total} images</span></div></section>

    {colors.length > 0 && category === "All" && <section className="mt-8 grid gap-5 rounded-[8px] border border-black/[0.08] bg-white p-5 dark:border-white/10 dark:bg-[#102720] lg:grid-cols-[220px_1fr] lg:items-center"><div><div className="flex items-center gap-2 text-[#56756a] dark:text-[#c9ff49]"><Palette size={15} /><p className="text-[9px] font-semibold">Colour studio</p></div><h2 className="mt-2 text-[18px] font-semibold">See every factory finish</h2></div><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{colors.map((color) => <div key={color.id} className="flex min-w-36 shrink-0 items-center gap-3 rounded-[6px] border border-black/[0.07] px-3 py-2.5 dark:border-white/10"><span className="flex overflow-hidden rounded-full border border-black/10">{color.shades.map((shade) => <span key={shade.sortOrder} className="h-7 w-5" style={{ backgroundColor: shade.colorHex }} />)}</span><span className="text-[9px] font-semibold">{color.colorName}</span></div>)}</div></section>}

    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">{remaining.map((image, index) => { const wide = index % 7 === 0; return <button key={image.id} type="button" onClick={() => setOpenIndex(index + 5)} className={`group relative min-h-56 overflow-hidden rounded-[8px] bg-[#e4eae6] text-left ${wide ? "lg:col-span-8 lg:min-h-96" : "lg:col-span-4"}`}><Image src={getPublicUploadUrl(image.imageUrl)!} alt={image.caption ?? `${carName} ${image.angle ?? "photo"}`} fill sizes={wide ? "66vw" : "34vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"><Maximize2 size={13} /></span>{(image.caption || image.angle) && <span className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 text-[9px] text-white backdrop-blur-sm">{image.caption ?? image.angle}</span>}</button>; })}</div>
    {images.length < total && <div className="mt-7 flex justify-center"><button type="button" disabled={loading} onClick={() => void fetchPage(page + 1, category, true)} className="min-w-36 rounded-[6px] bg-[#173d31] px-5 py-3 text-[10px] font-semibold text-white disabled:opacity-60">{loading ? "Loading..." : `Load more (${total - images.length})`}</button></div>}
    {active && <div role="dialog" aria-modal="true" aria-label={`${carName} photo viewer`} className="fixed inset-0 z-[80] grid place-items-center bg-[#05100d]/95 p-4"><button type="button" aria-label="Close photo" onClick={() => setOpenIndex(null)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"><X size={18} /></button><button type="button" aria-label="Previous photo" onClick={() => move(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white sm:left-6"><ChevronLeft size={20} /></button><div className="relative h-[75vh] w-[86vw]"><Image src={getPublicUploadUrl(active.imageUrl)!} alt={active.caption ?? carName} fill sizes="90vw" className="object-contain" /></div><button type="button" aria-label="Next photo" onClick={() => move(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white sm:right-6"><ChevronRight size={20} /></button><p className="absolute bottom-5 text-[10px] text-white/65">{openIndex! + 1} / {images.length}{active.caption ? `  |  ${active.caption}` : ""}</p></div>}
  </>;
}
