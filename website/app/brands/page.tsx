import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront, Layers3, Sparkles } from "lucide-react";
import BrandsDirectory from "@/components/brands/BrandsDirectory";
import BrandsDiscoverySidebar from "@/components/brands/BrandsDiscoverySidebar";
import ExploreBrandsSection from "@/components/brands/ExploreBrandsSection";
import DynamicCarRail from "@/components/home/DynamicCarRail";
import { getBrandsWithCounts } from "@/lib/brands/brand.api";
import { getHomeFeed } from "@/lib/home/home.api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Car Brands in India | Prices, Models and New Cars | ApniCars",
  description: "Explore every major car brand in India, compare model lineups and discover prices, body styles and the latest cars from each manufacturer.",
};

export default async function BrandsPage() {
  const [brands, feed] = await Promise.all([getBrandsWithCounts(), getHomeFeed()]);
  const rankedBrands = [...brands].sort((a, b) => b.count - a.count);
  const totalCars = brands.reduce((total, brand) => total + brand.count, 0);
  const leader = rankedBrands[0];

  return <main className="bg-white text-[#102019] dark:bg-[#0a1d18] dark:text-white">
    <section style={{ minHeight: 430, backgroundColor: "#071d17" }} className="relative flex overflow-hidden text-white">
      <Image src="/images/brands-directory-hero.webp" alt="Premium cars outside a contemporary showroom" fill priority sizes="100vw" className="object-cover object-[66%_center]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,17,.99)_0%,rgba(4,22,17,.91)_40%,rgba(4,22,17,.32)_72%,rgba(4,22,17,.10)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(4,20,16,.62)_0%,transparent_42%)]" />
      <div className="page-shell relative flex flex-col py-8 sm:py-10">
        <nav className="flex items-center gap-2 text-[9px] text-white/50"><Link href="/">Home</Link><span>/</span><span className="text-white/80">Brands</span></nav>
        <div className="my-auto max-w-[590px] py-8"><p className="text-[9px] font-semibold text-[#c9ff49]">Every marque. One considered directory.</p><h1 className="mt-2.5 text-[35px] font-semibold leading-[1.03] sm:text-[47px]">Car brands in India</h1><p className="mt-4 max-w-[520px] text-[11px] leading-5 text-white/68 sm:text-[12px]">Discover established manufacturers and emerging electric names, then move from brand to the right model without losing the details that matter.</p>{leader && <Link href={`/${leader.slug}-cars`} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#c9ff49] px-5 text-[9px] font-semibold text-[#10271f]">Explore {leader.name} cars <ArrowRight size={12} /></Link>}</div>
        <div className="grid max-w-[650px] grid-cols-3 border-t border-white/18 pt-4"><HeroStat icon={<Sparkles size={13} />} value={String(brands.length)} label="brands" /><HeroStat icon={<CarFront size={13} />} value={String(totalCars)} label="cars" /><HeroStat icon={<Layers3 size={13} />} value={leader?.name ?? "Updated"} label="largest range" /></div>
      </div>
    </section>

    <section className="bg-[#f4f6f4] py-10 dark:bg-[#081b16] sm:py-14"><div className="page-shell"><div className="mb-7"><p className="text-[9px] font-semibold text-[#698078]">Manufacturer directory</p><h2 className="mt-1.5 text-[26px] font-semibold sm:text-[31px]">Find your car brand</h2><p className="mt-2 max-w-[570px] text-[10px] leading-5 text-[#6a7872] dark:text-white/50">Search all active brands or browse the names with the widest model lineups.</p></div><div className="grid gap-7 lg:grid-cols-4 lg:items-start"><div className="lg:col-span-3"><BrandsDirectory brands={brands} /></div><BrandsDiscoverySidebar cars={feed?.cars.popular ?? []} stories={feed?.news ?? []} /></div></div></section>

    <DynamicCarRail eyebrow="Most considered" title="Popular cars in India" cars={feed?.cars.popular ?? []} href="/popular-cars" tone="white" />
    <ExploreBrandsSection brands={rankedBrands} eyebrow="High-interest manufacturers" title="Popular car brands" description="The manufacturers offering the broadest choice across price points and body styles." />
  </main>;
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="min-w-0 border-r border-white/15 px-3 first:pl-0 last:border-r-0"><span className="flex items-center gap-1.5 text-[9px] text-[#c9ff49]">{icon}{label}</span><strong className="mt-1 block truncate text-[13px] font-semibold sm:text-[15px]">{value}</strong></div>;
}
