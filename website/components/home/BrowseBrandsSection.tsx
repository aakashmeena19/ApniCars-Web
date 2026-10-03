import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeBrand } from "@/lib/home/home.types";

export default function BrowseBrandsSection({ brands }: { brands: HomeBrand[] }) {
  if (brands.length === 0) return null;
  return <section className="bg-white py-12 dark:bg-[#0a1d18] sm:py-14 lg:py-16"><div className="page-shell"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b847b]">Leading names in motoring</p><h2 className="mt-2 text-[26px] font-semibold text-[#0c1814] dark:text-white sm:text-[31px]">Browse by brand</h2></div><Link href="/brands" className="hidden items-center gap-2 text-[10px] font-semibold text-[#31574b] hover:text-[#698500] dark:text-white/70 sm:flex">View all brands <ArrowRight size={13} /></Link></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{brands.map((brand) => { const logo = getPublicUploadUrl(brand.logoUrl); return <Link key={brand.id} href={`/${brand.slug}-cars`} className="group flex min-h-[118px] flex-col items-center justify-center gap-3 rounded-[8px] border border-black/[0.07] bg-[#f8faf8] p-4 transition-all hover:-translate-y-0.5 hover:border-[#9db77c] hover:shadow-[0_10px_24px_rgba(8,31,25,.08)] dark:border-white/10 dark:bg-[#102720]"><span className="relative grid h-12 w-20 place-items-center">{logo ? <Image src={logo} alt={`${brand.name} logo`} fill sizes="80px" className="object-contain" /> : <CarFront size={28} className="text-[#648078]" />}</span><span className="text-center text-[11px] font-semibold text-[#1a2b24] dark:text-white">{brand.name}</span></Link>; })}</div></div></section>;
}
