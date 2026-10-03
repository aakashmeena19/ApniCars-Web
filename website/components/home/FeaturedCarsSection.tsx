"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import PremiumCarCard from "@/components/common/PremiumCarCard";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";

const featuredCars = [
  {
    name: "Hyundai Creta",
    variant: "SX Tech 1.5 Petrol",
    price: "Rs. 11.20 - 20.50 Lakh",
    badge: "Popular",
    image: "/images/car-suv-city.jpg",
  },
  {
    name: "Mahindra XUV700",
    variant: "AX7 Diesel",
    price: "Rs. 14.49 - 25.14 Lakh",
    badge: "New",
    image: "/images/car-suv-close.jpg",
  },
  {
    name: "Tata Nexon EV",
    variant: "Empowered 45",
    price: "Rs. 12.49 - 17.19 Lakh",
    badge: "Best value",
    image: "/images/car-suv-wide.jpg",
  },
  {
    name: "Premium Crossover",
    variant: "Performance Edition",
    price: "Rs. 18.90 - 24.50 Lakh",
    badge: "Featured",
    image: "/images/exec-c1f0ce18-cae7-42dc-938e-3216f8a96339.png",
  },
  { name: "Tata Harrier", variant: "Fearless Plus", price: "Rs. 15.00 - 26.50 Lakh", badge: "Trending", image: "/images/hero-car.png" },
  { name: "Kia Seltos", variant: "GTX Plus", price: "Rs. 11.30 - 20.50 Lakh", badge: "Top rated", image: "/images/hero-light-premium.png" },
];

export default function FeaturedCarsSection() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-[#eef3f0] py-12 text-[#10221b] sm:py-14 lg:py-16 dark:bg-[#061f1b] dark:text-white">
      <div className="page-shell">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#607e74] dark:text-[#99bdb2]">Featured vehicles</p>
            <h2 className="mt-2 text-[26px] font-semibold leading-tight sm:text-[31px]">Our featured cars</h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex"><SliderArrows onPrevious={() => scrollByCard(scroller.current, "left")} onNext={() => scrollByCard(scroller.current, "right")} /><Link href="/cars" className="group ml-2 flex items-center gap-2 text-[9px] font-bold text-[#49665c] transition-colors hover:text-[#698500] dark:text-white/70 dark:hover:text-[#c9ff49]">View all vehicles <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" /></Link></div>
        </div>

        <div ref={scroller} className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredCars.map((car, index) => <div key={car.name} className="w-[84vw] max-w-[310px] shrink-0 snap-start sm:w-[calc((100%_-_20px)/2)] sm:max-w-none xl:w-[calc((100%_-_60px)/4)]"><PremiumCarCard name={car.name} meta={car.variant} price={car.price} image={car.image} badge={car.badge} badgeTone={index === 2 ? "warm" : "lime"} /></div>)}
        </div>

        <Link href="/cars" className="mt-6 inline-flex items-center gap-2 text-[9px] font-bold text-[#49665c] sm:hidden dark:text-white/70">View all vehicles <ArrowRight size={13} /></Link>
      </div>
    </section>
  );
}
