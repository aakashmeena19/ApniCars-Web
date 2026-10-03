import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { formatPriceRange, getCarMeta } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar } from "@/lib/home/home.types";

export default function BrandCarCard({ car, priority = false }: { car: HomeCar; priority?: boolean }) {
  const image = getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-light-premium.png";
  return <article className="group overflow-hidden rounded-[8px] border border-black/[0.08] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#92aa86] hover:shadow-[0_14px_28px_rgba(8,31,25,.09)] dark:border-white/10 dark:bg-[#102720]">
    <Link href={`/model/${car.slug}`} className="block">
      <div style={{ aspectRatio: "16 / 9" }} className="relative overflow-hidden bg-[#e9eeeb]"><Image src={image} alt={`${car.brand.name} ${car.name}`} fill priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 26vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />{car.isElectric && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#c9ff49] px-2.5 py-1 text-[9px] font-semibold text-[#153127]"><Zap size={10} /> Electric</span>}</div>
      <div className="p-3.5"><p className="text-[9px] text-[#75837d] dark:text-white/45">{getCarMeta(car)}</p><div className="mt-1.5 flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-[#14261f] dark:text-white">{car.brand.name} {car.name}</h3><p className="mt-1 text-[11px] font-semibold text-[#315447] dark:text-[#dfff97]">{formatPriceRange(car)}</p></div><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-[#315447] transition-colors group-hover:bg-[#173a30] group-hover:text-white dark:border-white/15 dark:text-white"><ArrowUpRight size={13} /></span></div></div>
    </Link>
  </article>;
}
