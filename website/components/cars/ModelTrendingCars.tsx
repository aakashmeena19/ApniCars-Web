"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeCar } from "@/lib/home/home.types";
import { getBrandCarsPath, getModelPath } from "@/lib/cars/car.urls";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";

type Tab = "popular" | "upcoming";

export default function ModelTrendingCars({ cars, brandName, brandSlug }: { cars: HomeCar[]; brandName: string; brandSlug: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("popular");
  const lists = useMemo(() => {
    const upcoming = cars.filter((car) => car.launchStatus.toLowerCase().includes("upcoming"));
    const launched = cars.filter((car) => !car.launchStatus.toLowerCase().includes("upcoming"));
    return { popular: (launched.length > 0 ? launched : cars).slice(0, 5), upcoming: upcoming.slice(0, 5) };
  }, [cars]);
  const visibleCars = lists[activeTab];

  if (cars.length === 0) return null;

  return <section className="overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720]">
    <div className="border-b border-black/[0.07] px-4 pt-4 dark:border-white/10"><h3 className="text-[15px] font-semibold">Trending cars</h3><div className="mt-3 flex gap-6"><TabButton active={activeTab === "popular"} onClick={() => setActiveTab("popular")}>Popular</TabButton><TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")}>Upcoming</TabButton></div></div>
    <div className="p-3">
      {visibleCars.length > 0 ? <div className="space-y-1">{visibleCars.map((car) => <Link key={car.id} href={getModelPath(car.brand.slug, car.slug)} className="group flex items-center gap-3 rounded-[6px] px-1 py-2 transition-colors hover:bg-[#f1f5f2] dark:hover:bg-white/[0.05]"><span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[5px] bg-[#e7ebe8]"><Image src={getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png"} alt="" fill sizes="64px" className="object-contain p-1" /></span><span className="min-w-0 flex-1"><strong className="block text-[10px] font-semibold leading-4">{car.brand.name} {car.name}</strong><small className="mt-0.5 block text-[9px] font-semibold leading-4 text-[#435d53] dark:text-[#dfff97]">{formatPriceRange(car)}</small></span></Link>)}</div> : <p className="px-2 py-5 text-[10px] leading-5 text-[#718078] dark:text-white/45">No upcoming cars are listed in this comparison set yet.</p>}
    </div>
    <Link href={getBrandCarsPath(brandSlug)} className="flex items-center gap-2 border-t border-black/[0.07] px-4 py-3 text-[9px] font-semibold text-[#55710a] dark:border-white/10 dark:text-[#dfff97]">View all {brandName} cars <ArrowRight size={11} /></Link>
  </section>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`relative pb-2.5 text-[9px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#a7dc20] ${active ? "text-[#173d31] after:scale-x-100 dark:text-white" : "text-[#8a958f] after:scale-x-0 dark:text-white/38"}`}>{children}</button>;
}
