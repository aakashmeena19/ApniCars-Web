import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar } from "@/lib/home/home.types";

export default function BrandCompareStrip({ brandName, cars }: { brandName: string; cars: HomeCar[] }) {
  if (cars.length < 2) return null;
  return <section className="bg-[#0b2820] py-12 text-white sm:py-14"><div className="page-shell"><div className="grid gap-8 lg:grid-cols-4 lg:items-center">
    <div><p className="text-[9px] font-semibold text-[#c9ff49]">Side-by-side shortlist</p><h2 className="mt-2 text-[24px] font-semibold sm:text-[28px]">Compare popular {brandName} cars</h2><p className="mt-3 text-[10px] leading-5 text-white/50">Put specifications, prices and key details next to each other.</p><Link href="/compare" className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold text-[#dfff97]">Open comparison tool <ArrowRight size={13} /></Link></div>
    <div className="grid gap-px overflow-hidden rounded-[8px] bg-white/10 sm:grid-cols-3 lg:col-span-3">{cars.slice(0, 3).map((car) => <Link key={car.id} href={`/model/${car.slug}`} className="group bg-[#12362c] p-4 hover:bg-[#174236]"><div style={{ aspectRatio: "16 / 8" }} className="relative overflow-hidden rounded-[5px] bg-white/5"><Image src={getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png"} alt="" fill sizes="(max-width: 640px) 100vw, 30vw" className="object-cover transition-transform group-hover:scale-[1.03]" /></div><h3 className="mt-3 text-[13px] font-semibold">{car.brand.name} {car.name}</h3><p className="mt-1 text-[10px] text-white/48">{formatPriceRange(car)}</p><span className="mt-3 flex items-center gap-1.5 text-[9px] text-[#c9ff49]"><Check size={11} /> Add to compare</span></Link>)}</div>
  </div></div></section>;
}
