import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BatteryCharging, Gauge } from "lucide-react";
import type { HomeCar } from "@/lib/home/home.types";
import { getModelPath } from "@/lib/cars/car.urls";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";

export default function CarSuggestions({ cars, title = "Cars worth considering" }: { cars: HomeCar[]; title?: string }) {
  if (cars.length === 0) return null;
  return <section className="bg-[#0a2820] py-12 text-white sm:py-14"><div className="page-shell"><p className="text-[10px] font-semibold text-[#c9ff49]">Smart alternatives</p><div className="mt-1 flex items-end justify-between gap-5"><h2 className="text-[25px] font-semibold sm:text-[30px]">{title}</h2><Link href="/new-cars" className="hidden text-[9px] font-semibold text-white/60 sm:block">Browse all cars</Link></div><div className="mt-7 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">{cars.slice(0, 4).map((car) => <Link key={car.id} href={getModelPath(car.brand.slug, car.slug)} className="group w-72 shrink-0 overflow-hidden rounded-[8px] border border-white/10 bg-[#12362c] lg:w-auto"><div className="relative aspect-[16/9] bg-white/5"><Image src={getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png"} alt={`${car.brand.name} ${car.name}`} fill sizes="(max-width: 1024px) 288px, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /><span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40"><ArrowUpRight size={13} /></span></div><div className="p-4"><p className="text-[9px] text-white/42">{car.bodyType?.name ?? "Car"}</p><h3 className="mt-1 text-[14px] font-semibold">{car.brand.name} {car.name}</h3><p className="mt-2 text-[11px] font-semibold text-[#dfff97]">{formatPriceRange(car)}</p><div className="mt-4 flex gap-4 border-t border-white/10 pt-3 text-[9px] text-white/48">{car.specs?.range ? <span className="flex items-center gap-1.5"><BatteryCharging size={11} />{car.specs.range} km</span> : null}{car.specs?.engineCc ? <span className="flex items-center gap-1.5"><Gauge size={11} />{car.specs.engineCc} cc</span> : null}</div></div></Link>)}</div></div></section>;
}
