import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCity } from "@/lib/home/home.types";

export default function PopularCitiesSection({ cities }: { cities: HomeCity[] }) {
  if (cities.length === 0) return null;
  return <section className="bg-[#f5f7f4] py-12 dark:bg-[#081b16] sm:py-14"><div className="page-shell"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#688078]">Explore locally</p><h2 className="mt-2 text-[26px] font-semibold text-[#0b1713] dark:text-white sm:text-[31px]">Popular cities</h2><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">{cities.map((city) => { const logo = getPublicUploadUrl(city.logoUrl); return <Link key={city.id} href={`/cars?city=${city.slug}`} className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-[8px] border border-black/[0.07] bg-white p-3 text-center transition-colors hover:border-[#9db77c] dark:border-white/10 dark:bg-[#102720]">{logo ? <span className="relative h-8 w-12"><Image src={logo} alt="" fill sizes="48px" className="object-contain" /></span> : <MapPin size={20} className="text-[#789315]" />}<span className="text-[11px] font-semibold text-[#1a2b24] dark:text-white">{city.name}</span></Link>; })}</div></div></section>;
}
