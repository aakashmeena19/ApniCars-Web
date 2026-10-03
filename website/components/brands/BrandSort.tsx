"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "popularity", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function BrandSort({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return <label className="flex h-10 items-center gap-2 rounded-[6px] border border-black/10 bg-white px-3 text-[9px] text-[#6c7a74] dark:border-white/10 dark:bg-[#102720] dark:text-white/55"><span className="hidden sm:inline">Sort by</span><select value={value} onChange={(event) => { const params = new URLSearchParams(searchParams.toString()); params.set("sort", event.target.value); params.delete("page"); router.push(`${pathname}?${params.toString()}`, { scroll: false }); }} className="bg-transparent text-[10px] font-semibold text-[#20392f] outline-none dark:text-white">{options.map((option) => <option key={option.value} value={option.value} className="text-black">{option.label}</option>)}</select></label>;
}
