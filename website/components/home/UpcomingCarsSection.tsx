"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, CalendarDays } from "lucide-react";
import { useRef } from "react";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";

const upcomingCars = [
  { name: "Tata Sierra EV", price: "Rs. 25 - 30 Lakh", launch: "Expected late 2026", image: "/images/car-suv-city.jpg" },
  { name: "Mahindra BE 07", price: "Rs. 29 - 35 Lakh", launch: "Expected early 2027", image: "/images/car-suv-close.jpg" },
  { name: "Renault Duster", price: "Rs. 10 - 18 Lakh", launch: "Expected mid 2027", image: "/images/car-suv-wide.jpg" },
  { name: "Skoda Elroq", price: "Rs. 30 - 38 Lakh", launch: "Expected late 2027", image: "/images/hero-light-premium.png" },
  { name: "Hyundai Ioniq 6", price: "Rs. 55 - 65 Lakh", launch: "Expected in 2027", image: "/images/hero-light.jpg" },
  { name: "Kia EV5", price: "Rs. 45 - 55 Lakh", launch: "Expected in 2027", image: "/images/exec-c1f0ce18-cae7-42dc-938e-3216f8a96339.png" },
];

export default function UpcomingCarsSection() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#f4f7f4] py-12 dark:bg-[#081b16] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#688078]">Coming next</p>
            <h2 className="mt-2 text-[26px] font-semibold text-[#0c1a15] dark:text-white sm:text-[31px]">Upcoming cars to watch</h2>
            <p className="mt-3 max-w-[500px] text-[11px] leading-5 text-[#68746e] dark:text-white/55">Keep an eye on the models expected to shape the next wave of new car launches.</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <SliderArrows onPrevious={() => scrollByCard(scroller.current, "left")} onNext={() => scrollByCard(scroller.current, "right")} />
            <Link href="/upcoming-cars" className="group ml-2 flex items-center gap-2 text-[10px] font-semibold text-[#31574b] hover:text-[#6d880d] dark:text-white/70 dark:hover:text-[#c9ff49]">View all upcoming cars <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
        </div>

        <div ref={scroller} className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {upcomingCars.map((car) => (
            <article key={car.name} className="group w-[86vw] max-w-[390px] shrink-0 snap-start overflow-hidden rounded-[8px] border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(8,31,25,.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a5bd91] hover:shadow-[0_14px_30px_rgba(8,31,25,.10)] dark:border-white/10 dark:bg-[#102720] dark:hover:border-[#c9ff49]/35 sm:w-[calc((100%_-_16px)/2)] sm:max-w-none lg:w-[calc((100%_-_32px)/3)]">
              <div className="relative aspect-[16/8.5] overflow-hidden bg-[#e9eeeb]">
                <Image src={car.image} alt={`${car.name} preview`} fill sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <span className="absolute left-3 top-3 rounded-full bg-[#c9ff49] px-2.5 py-1 text-[9px] font-semibold text-[#173027]">Upcoming</span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-semibold text-[#15251e] dark:text-white">{car.name}</h3>
                    <p className="mt-1 text-[13px] font-semibold text-[#31564a] dark:text-white/85">{car.price}</p>
                  </div>
                  <Link href="/upcoming-cars" aria-label={`Get launch updates for ${car.name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#b5c7ae] text-[#31584b] transition-colors hover:border-[#173a30] hover:bg-[#173a30] hover:text-white dark:border-white/20 dark:text-white dark:hover:border-[#c9ff49] dark:hover:bg-[#c9ff49] dark:hover:text-[#14281f]"><Bell size={14} /></Link>
                </div>
                <p className="mt-3 flex items-center gap-2 border-t border-black/[0.07] pt-3 text-[10px] font-medium text-[#75817c] dark:border-white/10 dark:text-white/50"><CalendarDays size={13} className="text-[#6e8913] dark:text-[#c9ff49]" />{car.launch}</p>
              </div>
            </article>
          ))}
        </div>

        <Link href="/upcoming-cars" className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold text-[#31574b] dark:text-white/70 sm:hidden">View all upcoming cars <ArrowRight size={13} /></Link>
      </div>
    </section>
  );
}
