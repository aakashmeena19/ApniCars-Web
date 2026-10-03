import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, CarFront, Fuel } from "lucide-react";
import type { BrandCarsFilters } from "@/lib/brands/brand.types";

export default function BrandDiscoverySection({ brandName, slug, filters }: { brandName: string; slug: string; filters: BrandCarsFilters }) {
  const bodyTypes = filters.bodyTypes.slice(0, 4);
  const fuelTypes = filters.fuelTypes.slice(0, 4);
  if (bodyTypes.length === 0 && fuelTypes.length === 0) return null;
  return <section id="explore-range" className="bg-[#f2f5f3] py-10 dark:bg-[#081b16] sm:py-12"><div className="page-shell"><p className="text-[9px] font-semibold text-[#698078]">Quicker ways to shortlist</p><h2 className="mt-1 text-[23px] font-semibold sm:text-[27px]">Explore the {brandName} range</h2><div className="mt-6 grid gap-3 lg:grid-cols-3"><DiscoveryGroup icon={<BadgeIndianRupee size={15} />} title="By budget" items={[{ label: "Under Rs. 10 lakh", href: `/${slug}-cars?maxPrice=1000000` }, { label: "Rs. 10 - 20 lakh", href: `/${slug}-cars?minPrice=1000000&maxPrice=2000000` }, { label: "Above Rs. 20 lakh", href: `/${slug}-cars?minPrice=2000000` }]} /><DiscoveryGroup icon={<CarFront size={15} />} title="By body style" items={bodyTypes.map((item) => ({ label: `${item.name} (${item.count})`, href: `/${slug}-cars?bodyType=${item.slug}` }))} /><DiscoveryGroup icon={<Fuel size={15} />} title="By fuel type" items={fuelTypes.map((item) => ({ label: `${item.label} (${item.count})`, href: `/${slug}-cars?fuelType=${item.value}` }))} /></div></div></section>;
}

function DiscoveryGroup({ icon, title, items }: { icon: React.ReactNode; title: string; items: { label: string; href: string }[] }) {
  return <div className="rounded-[7px] border border-black/[0.07] bg-white p-4 dark:border-white/10 dark:bg-[#102720]"><div className="flex items-center gap-2 text-[#315447] dark:text-[#c9ff49]">{icon}<h3 className="text-[12px] font-semibold text-[#172a22] dark:text-white">{title}</h3></div><div className="mt-3 divide-y divide-black/[0.06] dark:divide-white/10">{items.map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between py-2.5 text-[10px] text-[#5d6e66] first:pt-1 hover:text-[#1d4d3e] dark:text-white/58 dark:hover:text-white"><span>{item.label}</span><ArrowRight size={11} /></Link>)}</div></div>;
}
