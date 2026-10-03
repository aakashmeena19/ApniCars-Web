"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CarFront, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { BrandSummary } from "@/lib/brands/brand.types";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BrandsDirectory({ brands }: { brands: BrandSummary[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("");
  const [sort, setSort] = useState<"name" | "count">("name");
  const visibleBrands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return brands.filter((brand) => (!normalized || brand.name.toLowerCase().includes(normalized)) && (!letter || brand.name.startsWith(letter))).sort((a, b) => sort === "count" ? b.count - a.count || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  }, [brands, letter, query, sort]);

  return <div style={{ maxWidth: "calc(100vw - 32px)" }} className="min-w-0 overflow-hidden">
    <div className="flex flex-col gap-3 border-b border-black/[0.08] pb-5 sm:flex-row dark:border-white/10">
      <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-black/10 bg-white px-3 shadow-sm focus-within:border-[#76930d] dark:border-white/10 dark:bg-[#102720]"><Search size={15} className="text-[#65776f]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search car brands" className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#8b9892]" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label>
      <div className="flex h-11 shrink-0 items-center rounded-[6px] border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-[#102720]"><SortButton active={sort === "name"} onClick={() => setSort("name")}>A-Z</SortButton><SortButton active={sort === "count"} onClick={() => setSort("count")}>Most models</SortButton></div>
    </div>
    <div className="mt-4 flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><LetterButton active={!letter} onClick={() => setLetter("")}>All</LetterButton>{alphabet.map((item) => <LetterButton key={item} active={letter === item} disabled={!brands.some((brand) => brand.name.startsWith(item))} onClick={() => setLetter(item === letter ? "" : item)}>{item}</LetterButton>)}</div>
    <div className="mt-5 flex items-center justify-between"><p className="text-[10px] text-[#697972] dark:text-white/50"><strong className="text-[#15281f] dark:text-white">{visibleBrands.length}</strong> manufacturers</p>{(query || letter) && <button type="button" onClick={() => { setQuery(""); setLetter(""); }} className="text-[9px] font-semibold text-[#597300] dark:text-[#c9ff49]">Reset</button>}</div>
    {visibleBrands.length > 0 ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{visibleBrands.map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div> : <div className="mt-4 border border-dashed border-black/15 bg-white py-14 text-center dark:border-white/15 dark:bg-[#102720]"><CarFront size={26} className="mx-auto text-[#819089]" /><p className="mt-3 text-[11px] font-semibold">No matching brand found</p></div>}
  </div>;
}

function BrandCard({ brand }: { brand: BrandSummary }) {
  const logo = getPublicUploadUrl(brand.logoUrl);
  return <Link href={`/${brand.slug}-cars`} style={{ minHeight: 146 }} className="group flex flex-col overflow-hidden rounded-[7px] border border-black/[0.07] bg-white px-3.5 py-3 shadow-[0_4px_14px_rgba(8,31,25,.035)] transition-all hover:-translate-y-0.5 hover:border-[#91ab84] hover:shadow-[0_12px_24px_rgba(8,31,25,.08)] dark:border-white/10 dark:bg-[#102720]"><span style={{ height: 68 }} className="relative grid w-full shrink-0 place-items-center">{logo ? <Image src={logo} alt={`${brand.name} logo`} fill sizes="130px" className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" /> : <CarFront size={30} className="text-[#71837b]" />}</span><span className="mt-auto flex items-end justify-between gap-2 border-t border-black/[0.06] pt-2.5 dark:border-white/10"><span className="min-w-0"><strong className="block truncate text-[11px] font-semibold text-[#182820] dark:text-white">{brand.name}</strong><span className="mt-0.5 block text-[9px] text-[#7b8983]">{brand.count} models</span></span><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#b7c7b0] text-[#31584b] group-hover:bg-[#193b31] group-hover:text-white dark:border-white/15 dark:text-white"><ArrowUpRight size={11} /></span></span></Link>;
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`h-full rounded-[4px] px-3 text-[9px] font-semibold ${active ? "bg-[#17382e] text-white" : "text-[#617068] dark:text-white/60"}`}>{children}</button>;
}

function LetterButton({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" disabled={disabled} onClick={onClick} className={`h-7 min-w-7 shrink-0 rounded-[4px] px-1.5 text-[9px] font-semibold ${active ? "bg-[#c9ff49] text-[#143127]" : "border border-black/10 bg-white text-[#607068] dark:border-white/10 dark:bg-[#102720] dark:text-white/60"} disabled:opacity-25`}>{children}</button>;
}
