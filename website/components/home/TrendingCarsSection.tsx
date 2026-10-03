"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useRef } from "react";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";

const trendingCars = [
  { name: "Hyundai Creta", image: "/images/car-suv-city.jpg", href: "/cars/hyundai-creta", promoted: true },
  { name: "Mahindra XUV700", image: "/images/car-suv-close.jpg", href: "/cars/mahindra-xuv700" },
  { name: "Tata Nexon EV", image: "/images/car-suv-wide.jpg", href: "/cars/tata-nexon-ev" },
  { name: "BMW 5 Series", image: "/images/hero-light.jpg", href: "/cars/bmw-5-series" },
  { name: "Range Rover Sport", image: "/images/hero-light-premium.png", href: "/cars/range-rover-sport" },
  { name: "Maruti Grand Vitara", image: "/images/hero-car.png", href: "/cars/maruti-grand-vitara" },
  { name: "Mercedes C-Class", image: "/images/exec-c1f0ce18-cae7-42dc-938e-3216f8a96339.png", href: "/cars/mercedes-c-class" },
  { name: "Porsche 718", image: "/images/exec-2a7ef9b3-128e-4af4-b98e-729c104be27e.png", href: "/cars/porsche-718" },
];

export default function TrendingCarsSection() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#f5f6f3] pb-11 dark:bg-[#081b16] sm:pb-14">
      <div className="page-shell relative overflow-hidden rounded-[8px] border border-black/[0.06] bg-[#edf2ef] px-4 py-4 dark:border-white/10 dark:bg-[#102720] sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[#172820] dark:text-white"><div className="flex items-center gap-2"><TrendingUp size={15} className="text-[#66820d] dark:text-[#c9ff49]" /><h2 className="text-[15px] font-semibold">Trending Cars</h2></div><SliderArrows onPrevious={() => scrollByCard(scroller.current, "left")} onNext={() => scrollByCard(scroller.current, "right")} /></div>
        <div ref={scroller} className="flex gap-3 overflow-x-auto pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trendingCars.map((car) => (
            <Link key={car.name} href={car.href} className={`group relative flex h-[70px] w-[210px] shrink-0 items-center overflow-hidden rounded-[7px] border bg-white shadow-[0_5px_14px_rgba(8,31,25,.07)] transition-all hover:-translate-y-px hover:shadow-[0_8px_18px_rgba(8,31,25,.11)] dark:bg-[#0b1f1a] ${car.promoted ? "border-[#8da92d]" : "border-black/[0.08] dark:border-white/10"}`}>
              <span className="relative h-full w-[112px] shrink-0 overflow-hidden bg-[#e8eeea]"><Image src={car.image} alt="" fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" /></span>
              <span className="truncate px-3 text-[12px] font-semibold text-[#1c3028] dark:text-white">{car.name}</span>
              {car.promoted && <span className="absolute right-1.5 top-1 text-[7px] font-semibold text-[#718078] dark:text-white/45">Ad</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
