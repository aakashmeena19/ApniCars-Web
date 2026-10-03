"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import PremiumCarCard from "@/components/common/PremiumCarCard";
import SliderArrows from "@/components/common/SliderArrows";
import { scrollByCard } from "@/components/common/scrollByCard";

const cars = [
  { name: "Maruti Baleno", category: "Economy hatchback", price: "Rs. 6.70 - 9.92 Lakh", image: "/images/car-suv-wide.jpg" },
  { name: "Hyundai Creta", category: "Urban SUV", price: "Rs. 11.20 - 20.50 Lakh", image: "/images/car-suv-city.jpg" },
  { name: "BMW 5 Series", category: "Luxury sedan", price: "Rs. 76.60 - 79.90 Lakh", image: "/images/car-suv-close.jpg" },
  { name: "Premium GT", category: "Performance coupe", price: "Rs. 48.80 - 56.20 Lakh", image: "/images/exec-c1f0ce18-cae7-42dc-938e-3216f8a96339.png" },
  { name: "Tata Harrier", category: "Premium SUV", price: "Rs. 15.00 - 26.50 Lakh", image: "/images/hero-car.png" },
  { name: "Kia Seltos", category: "Compact SUV", price: "Rs. 11.30 - 20.50 Lakh", image: "/images/hero-light-premium.png" },
];

export default function PopularCarsSection() {
  const scroller = useRef<HTMLDivElement>(null);

  function slide(direction: "left" | "right") {
    scrollByCard(scroller.current, direction);
  }

  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="flex items-end justify-between gap-5">
          <div><p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#718980]">Popular vehicles</p><h2 className="mt-2 text-[25px] font-semibold text-[#0b1713] dark:text-white sm:text-[30px]">Choose your perfect car</h2></div>
          <div className="hidden items-center gap-2 sm:flex">
            <SliderArrows onPrevious={() => slide("left")} onNext={() => slide("right")} />
            <Link href="/popular-cars" className="ml-2 flex items-center gap-2 text-[9px] font-bold text-[#31574b] hover:text-[#17372d] dark:text-[#b7cec6] dark:hover:text-[#c9ff49]">View all vehicles <ArrowRight size={12} /></Link>
          </div>
        </div>

        <div ref={scroller} className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cars.map((car) => <div key={car.name} className="w-[84vw] max-w-[310px] shrink-0 snap-start sm:w-[calc((100%_-_20px)/2)] sm:max-w-none xl:w-[calc((100%_-_60px)/4)]"><PremiumCarCard name={car.name} meta={car.category} price={car.price} image={car.image} /></div>)}
        </div>
      </div>
    </section>
  );
}
