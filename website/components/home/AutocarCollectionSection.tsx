import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cars = [
  { name: "Mustang 5.0 V8 GT", price: "Rs. 74.61 - 84.10 Lakh", image: "/images/car-suv-close.jpg" },
  { name: "New BMW 5 Series", price: "Rs. 72.90 - 77.90 Lakh", image: "/images/car-suv-city.jpg" },
  { name: "Mercedes C-Class", price: "Rs. 61.85 - 70.00 Lakh", image: "/images/hero-light.jpg" },
  { name: "Audi R8 Coupe", price: "Rs. 2.30 - 2.72 Crore", image: "/images/exec-c1f0ce18-cae7-42dc-938e-3216f8a96339.png" },
  { name: "Range Rover Sport", price: "Rs. 1.45 - 2.95 Crore", image: "/images/car-suv-wide.jpg" },
  { name: "Porsche 718 Cayman", price: "Rs. 1.48 - 2.74 Crore", image: "/images/exec-2a7ef9b3-128e-4af4-b98e-729c104be27e.png" },
  { name: "BMW 4 Series", price: "Rs. 72.50 - 85.40 Lakh", image: "/images/exec-3a5c5bd7-c1f1-4f1e-84e1-ca6aa7590dfe.png" },
  { name: "Mercedes E-Class", price: "Rs. 78.50 - 92.50 Lakh", image: "/images/exec-315ae8f6-92a4-4bda-98fb-600e5ac4029b.png" },
];

export default function AutocarCollectionSection() {
  return (
    <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="shrink-0"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b847b]">Leading names in motoring</p><h2 className="mt-2 text-[25px] font-semibold text-[#0c1814] dark:text-white sm:text-[30px]">Popular Brands</h2></div>
          <span className="hidden h-px flex-1 bg-[#b9d46e] sm:block" />
          <Link href="/cars" className="ml-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-[5px] border border-[#315b4f] px-4 text-[9px] font-bold text-[#24463b] transition-colors hover:bg-[#092b24] hover:text-white dark:border-white/25 dark:text-white">View all <ArrowRight size={12} /></Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {cars.map((car) => (
            <article key={car.name} className="group min-w-0 overflow-hidden rounded-[8px] border border-black/[0.07] bg-white shadow-[0_6px_18px_rgba(8,31,25,.05)] transition-all hover:-translate-y-0.5 hover:border-[#a7bd8d] hover:shadow-[0_12px_26px_rgba(8,31,25,.09)] dark:border-white/10 dark:bg-[#102720] dark:hover:border-[#c9ff49]/35">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#eff2ef]">
                <Image src={car.image} alt={`${car.name} exterior`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-3.5"><h3 className="truncate text-[13px] font-semibold text-[#19251f] dark:text-white sm:text-[14px]">{car.name}</h3><p className="mt-1.5 text-[10px] font-semibold text-[#557067] dark:text-[#c7dbd4]">{car.price}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
