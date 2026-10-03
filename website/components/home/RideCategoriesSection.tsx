import Image from "next/image";
import Link from "next/link";
import { CarFront } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeBodyType } from "@/lib/home/home.types";

export default function RideCategoriesSection({ bodyTypes }: { bodyTypes: HomeBodyType[] }) {
  if (bodyTypes.length === 0) return null;
  return <section className="bg-[#f5f6f3] py-11 dark:bg-[#081b16] sm:py-14"><div className="page-shell"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#648178]">Find your fit</p><h2 className="mt-2 text-[26px] font-semibold leading-tight text-[#0b1512] dark:text-white sm:text-[31px]">Explore cars by body type</h2></div><p className="max-w-[360px] text-[11px] leading-5 text-[#626c68] dark:text-white/60">From compact city cars to spacious family SUVs, start with the shape that fits your everyday life.</p></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{bodyTypes.map((type) => { const icon = getPublicUploadUrl(type.iconUrl); return <Link key={type.id} href={`/cars?bodyType=${type.slug}`} className="group flex min-h-[142px] flex-col items-center justify-center gap-3 rounded-[8px] border border-black/[0.07] bg-[#eeefec] p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[#17463b] hover:bg-[#08261f] hover:text-white dark:border-white/10 dark:bg-[#102720] dark:text-white"><span className="relative grid h-16 w-full place-items-center">{icon ? <Image src={icon} alt="" fill sizes="180px" className="object-contain p-1 transition-transform group-hover:scale-105" /> : <CarFront size={38} className="text-[#58756b] group-hover:text-[#c9ff49]" />}</span><span className="text-[12px] font-semibold">{type.name}</span></Link>; })}</div></div></section>;
}

