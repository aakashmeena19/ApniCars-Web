"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import PremiumCarCard from "@/components/common/PremiumCarCard";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";
import { formatPriceRange, getCarMeta } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar } from "@/lib/home/home.types";

type Props = { eyebrow: string; title: string; cars: HomeCar[]; href: string; tone?: "white" | "soft" | "dark"; badge?: string };

export default function DynamicCarRail({ eyebrow, title, cars, href, tone = "white", badge }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  if (cars.length === 0) return null;
  const toneClass = tone === "dark" ? "bg-[#eef3f0] dark:bg-[#061f1b]" : tone === "soft" ? "bg-[#f5f7f4] dark:bg-[#081b16]" : "bg-white dark:bg-[#0a1d18]";

  return <section className={`${toneClass} py-12 sm:py-14 lg:py-16`}><div className="page-shell"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#688078]">{eyebrow}</p><h2 className="mt-2 text-[26px] font-semibold text-[#0b1713] dark:text-white sm:text-[31px]">{title}</h2></div><div className="hidden items-center gap-2 sm:flex"><SliderArrows onPrevious={() => scrollByCard(scroller.current, "left")} onNext={() => scrollByCard(scroller.current, "right")} /><Link href={href} className="group ml-2 flex items-center gap-2 text-[10px] font-semibold text-[#31574b] hover:text-[#698500] dark:text-white/70 dark:hover:text-[#c9ff49]">View all <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></Link></div></div><div ref={scroller} className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{cars.map((car) => <div key={car.id} className="w-[84vw] max-w-[310px] shrink-0 snap-start sm:w-[calc((100%_-_20px)/2)] sm:max-w-none xl:w-[calc((100%_-_60px)/4)]"><PremiumCarCard name={`${car.brand.name} ${car.name}`} meta={getCarMeta(car)} price={formatPriceRange(car)} image={getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png"} href={`/model/${car.slug}`} badge={badge} /></div>)}</div></div></section>;
}
