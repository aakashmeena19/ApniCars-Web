"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightLeft, CarFront, ChevronRight } from "lucide-react";
import { useRef } from "react";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";
import { formatPrice } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar } from "@/lib/home/home.types";

export default function CompareCarsSection({ cars }: { cars: HomeCar[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const pairs = Array.from({ length: Math.floor(cars.length / 2) }, (_, index) => [cars[index * 2], cars[index * 2 + 1]] as const);
  if (pairs.length === 0) return null;
  return <section className="bg-[#f7f9f7] py-12 dark:bg-[#081b16] sm:py-14 lg:py-16"><div className="page-shell"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b847b]">Side by side</p><h2 className="mt-2 text-[26px] font-semibold text-[#0c1a15] dark:text-white sm:text-[31px]">Compare cars</h2></div><div className="hidden items-center gap-2 sm:flex"><SliderArrows onPrevious={() => scrollByCard(scroller.current, "left")} onNext={() => scrollByCard(scroller.current, "right")} /><Link href="/compare" className="ml-2 flex items-center gap-2 text-[10px] font-semibold text-[#31574b] dark:text-white/70">View comparisons <ChevronRight size={13} /></Link></div></div><div ref={scroller} className="mt-7 flex gap-4 overflow-x-auto pb-1 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{pairs.map(([left, right]) => <article key={`${left.id}-${right.id}`} className="w-[86vw] max-w-[390px] shrink-0 rounded-[8px] border border-black/10 bg-white p-3 shadow-[0_7px_20px_rgba(8,31,25,.05)] dark:border-white/10 dark:bg-[#102720] lg:w-[calc((100%_-_32px)/3)] lg:max-w-none"><div className="relative grid grid-cols-2"><CompareCar car={left} /><span className="absolute bottom-0 left-1/2 top-0 w-px bg-black/10 dark:bg-white/10" /><span className="absolute left-1/2 top-[82px] z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-[#73920c] bg-white text-[8px] font-bold text-[#587009] dark:bg-[#102720] dark:text-[#c9ff49]">VS</span><CompareCar car={right} /></div><Link href={`/compare?left=${left.slug}&right=${right.slug}`} className="mt-4 flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[#497466] text-[11px] font-semibold text-[#31584b] hover:bg-[#0b3028] hover:text-white dark:text-white"><ArrowRightLeft size={14} />Compare now</Link></article>)}</div></div></section>;
}

function CompareCar({ car }: { car: HomeCar }) {
  const image = getPublicUploadUrl(car.coverImageUrl);
  return <div className="min-w-0 px-2"><div className="relative grid h-[120px] place-items-center overflow-hidden rounded-[5px] bg-[#eef1ee]">{image ? <Image src={image} alt={`${car.brand.name} ${car.name}`} fill sizes="190px" className="object-contain p-2" /> : <CarFront size={30} className="text-[#74847e]" />}</div><h3 className="mt-3 min-h-[34px] text-[12px] font-semibold leading-4 text-[#283831] dark:text-white">{car.brand.name} {car.name}</h3><p className="mt-1 text-[11px] font-semibold text-[#101b17] dark:text-white/85">{formatPrice(car.priceMin) ?? "Price TBA"}</p><p className="mt-0.5 text-[9px] text-[#89918d] dark:text-white/40">onwards</p></div>;
}

