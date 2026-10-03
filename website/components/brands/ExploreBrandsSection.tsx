import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { BrandSummary } from "@/lib/brands/brand.types";

type Props = { brands: BrandSummary[]; eyebrow?: string; title?: string; description?: string };

export default function ExploreBrandsSection({ brands, eyebrow = "Keep exploring", title = "More car brands", description }: Props) {
  if (brands.length === 0) return null;
  return <section className="border-t border-black/[0.07] bg-white py-12 dark:border-white/10 dark:bg-[#0b201a] sm:py-14"><div className="page-shell"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-semibold text-[#698078]">{eyebrow}</p><h2 className="mt-1.5 text-[25px] font-semibold text-[#0d1d17] dark:text-white sm:text-[29px]">{title}</h2>{description && <p className="mt-2 max-w-[560px] text-[10px] leading-5 text-[#6a7872] dark:text-white/50">{description}</p>}</div><Link href="/brands" className="hidden items-center gap-2 text-[10px] font-semibold text-[#31574b] dark:text-white/70 sm:flex">All brands <ArrowRight size={13} /></Link></div><div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-4 lg:grid-cols-8 dark:border-white/10 dark:bg-white/10">{brands.slice(0, 8).map((brand) => { const logo = getPublicUploadUrl(brand.logoUrl); return <Link key={brand.id} href={`/${brand.slug}-cars`} className="group flex min-h-28 flex-col items-center justify-center bg-white p-3 text-center hover:bg-[#f4f8ee] dark:bg-[#102720] dark:hover:bg-[#15362c]">{logo ? <div style={{ width: 58, height: 38 }} className="relative"><Image src={logo} alt={`${brand.name} logo`} fill sizes="58px" className="object-contain" /></div> : <CarFront size={25} className="text-[#71837b]" />}<p className="mt-2.5 text-[10px] font-semibold text-[#193129] dark:text-white">{brand.name}</p><span className="mt-0.5 text-[9px] text-[#7a8882]">{brand.count} models</span></Link>; })}</div></div></section>;
}
