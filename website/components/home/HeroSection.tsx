import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, Play, ShieldCheck } from "lucide-react";
import HeroSearchBar from "@/components/home/HeroSearchBar";
import HeroBackgroundCarousel from "@/components/home/HeroBackgroundCarousel";
import type { HomeBanner, HomeBodyType, HomeBrand } from "@/lib/home/home.types";

const trustPoints = [
  { title: "Premium selection", text: "Verified models", icon: BadgeCheck },
  { title: "Expert support", text: "Guidance when needed", icon: Headphones },
  { title: "Easy comparison", text: "Clear car details", icon: ShieldCheck },
];

type Props = { banners: HomeBanner[]; brands: HomeBrand[]; bodyTypes: HomeBodyType[] };

export default function HeroSection({ banners, brands, bodyTypes }: Props) {
  const banner = banners[0];
  const eyebrow = banner?.tagLabel || "Premium car discovery";
  const heading = banner?.heading || "Drive Your";
  const highlight = banner?.highlightText || "Dream Car";
  const description = banner?.description || "Explore premium cars, compare the details that matter and find a vehicle that feels made for your journey.";
  const ctaText = banner?.ctaText || "Explore cars";
  const ctaLink = banner?.ctaLink || "/cars";

  return (
    <section className="relative isolate overflow-hidden bg-[#061f1b] text-white">
      <HeroBackgroundCarousel banners={banners} />
      <div className="page-shell relative z-10 flex min-h-[740px] items-start pb-[230px] pt-14 sm:min-h-[760px] sm:pb-[235px] sm:pt-20 lg:min-h-[620px] lg:items-center lg:pb-[130px] lg:pt-10">
        <div className="max-w-[540px]">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase text-white/60"><span className="h-px w-7 bg-[#c9ff49]" />{eyebrow}</p>
          <h1 className="mt-5 text-[47px] font-semibold leading-[.98] sm:text-[61px] lg:text-[68px]">{heading}<br /><span className="text-[#c9ff49]">{highlight}</span></h1>
          <p className="mt-5 max-w-[460px] text-[14px] leading-6 text-white/70 sm:text-[15px]">{description}</p>
          <div className="mt-7 grid max-w-[510px] grid-cols-1 gap-3 sm:grid-cols-3">
            {trustPoints.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#c9ff49]/35 bg-white/[0.04] text-[#c9ff49]"><Icon size={14} /></span><span><span className="block text-[9px] font-semibold">{item.title}</span><span className="mt-0.5 block text-[7px] text-white/45">{item.text}</span></span></div>; })}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={ctaLink} className="inline-flex h-11 items-center gap-2.5 rounded-full bg-[#c9ff49] px-5 text-[11px] font-semibold text-[#10271f] shadow-[0_10px_24px_rgba(201,255,73,.15)] transition-all hover:-translate-y-px hover:bg-[#bdec3f]">{ctaText} <ArrowRight size={14} /></Link>
            <Link href="/compare" className="group inline-flex h-11 items-center gap-3 px-2 text-[11px] font-medium text-white/80 hover:text-white"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/10 transition-colors group-hover:border-[#c9ff49]/50 group-hover:text-[#c9ff49]"><Play size={13} fill="currentColor" /></span>Compare cars</Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5 z-20"><div className="page-shell"><HeroSearchBar brands={brands} bodyTypes={bodyTypes} /></div></div>
    </section>
  );
}

