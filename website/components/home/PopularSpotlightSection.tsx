import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck } from "lucide-react";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar } from "@/lib/home/home.types";
import { getModelPath } from "@/lib/cars/car.urls";

export default function PopularSpotlightSection({ car }: { car: HomeCar | null }) {
  if (!car) return null;
  const image = getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png";
  const performance = car.isElectric ? (car.specs?.range ? `${car.specs.range} km range` : "Electric") : (car.specs?.mileage ? `${car.specs.mileage} kmpl` : car.bodyType?.name ?? "Popular");
  return <section className="bg-[#f5f6f3] pb-11 dark:bg-[#081b16] sm:pb-14"><div className="page-shell relative min-h-[330px] overflow-hidden rounded-[8px] bg-[#07231e] text-white shadow-[0_18px_45px_rgba(7,35,30,.16)]"><Image src={image} alt={`${car.brand.name} ${car.name}`} fill sizes="100vw" className="object-cover object-[65%_center] opacity-[.82] dark:opacity-75" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,34,29,.95)_0%,rgba(6,34,29,.86)_31%,rgba(6,34,29,.13)_65%,rgba(6,34,29,.60)_100%)]" /><div className="relative z-10 grid min-h-[330px] gap-8 px-6 py-9 sm:px-9 lg:grid-cols-[.72fr_1.28fr_.58fr] lg:items-center lg:px-10"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#bad8cf]">Popular right now</p><h2 className="mt-2 text-[28px] font-semibold leading-[1.05] sm:text-[33px]">{car.brand.name}<br />{car.name}</h2><p className="mt-4 max-w-[280px] text-[11px] leading-5 text-white/68">One of the most highly rated models buyers are exploring right now.</p><Link href={getModelPath(car.brand.slug, car.slug)} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#c9ff49] px-5 text-[10px] font-bold text-[#09221c] hover:bg-[#b8ec3d]">Explore model <ArrowRight size={14} /></Link></div><div className="hidden lg:block" /><div className="self-start rounded-[6px] border border-white/15 bg-black/28 p-5 backdrop-blur-md lg:self-center"><div className="flex items-center gap-2 text-[#c9ff49]"><ShieldCheck size={15} /><p className="text-[9px] font-semibold">Popular choice</p></div><p className="mt-3 text-[15px] font-semibold">{car.bodyType?.name ?? "Premium car"}</p><div className="mt-4 border-t border-white/15 pt-4"><p className="text-[9px] text-white/55">Price range</p><p className="mt-1 text-[17px] font-semibold">{formatPriceRange(car)}</p></div><p className="mt-4 flex items-center gap-2 text-[9px] text-white/65"><Gauge size={13} className="text-[#c9ff49]" />{performance}</p></div></div></div></section>;
}

