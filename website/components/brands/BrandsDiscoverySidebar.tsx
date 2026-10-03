import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeCar, HomeNewsStory } from "@/lib/home/home.types";

export default function BrandsDiscoverySidebar({ cars, stories }: { cars: HomeCar[]; stories: HomeNewsStory[] }) {
  if (cars.length === 0 && stories.length === 0) return null;
  return <aside className="lg:sticky lg:top-[104px]">
    {cars.length > 0 && <section className="border-t-2 border-[#183a30] bg-white px-4 py-5 shadow-[0_8px_24px_rgba(8,31,25,.055)] dark:bg-[#102720]"><SectionTitle eyebrow="Buyer favourites" title="Popular cars" href="/popular-cars" /> <div className="mt-4 divide-y divide-black/[0.07] dark:divide-white/10">{cars.slice(0, 5).map((car) => <Link key={car.id} href={`/model/${car.slug}`} className="group flex gap-3 py-3 first:pt-0 last:pb-0"><div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[5px] bg-[#e9eeeb]"><Image src={getPublicUploadUrl(car.coverImageUrl) ?? "/images/hero-car.png"} alt="" fill sizes="80px" className="object-cover transition-transform group-hover:scale-105" /></div><div className="min-w-0 self-center"><h3 className="truncate text-[11px] font-semibold text-[#172b23] dark:text-white">{car.brand.name} {car.name}</h3><p className="mt-1 truncate text-[9px] text-[#708079] dark:text-white/45">{formatPriceRange(car)}</p></div></Link>)}</div></section>}
    {stories.length > 0 && <section className="mt-4 border-t-2 border-[#c9ff49] bg-[#0c2a22] px-4 py-5 text-white"><SectionTitle eyebrow="Fresh from the desk" title="Latest news" href="/news" inverse /><div className="mt-4 divide-y divide-white/10">{stories.slice(0, 4).map((story) => <Link key={story.id} href={`/news/${story.slug}`} className="group block py-3 first:pt-0 last:pb-0"><p className="line-clamp-2 text-[11px] font-semibold leading-4 text-white/90 group-hover:text-[#dfff97]">{story.title}</p><span className="mt-1.5 flex items-center gap-1.5 text-[9px] text-white/40"><Clock3 size={10} />{story.readTimeMinutes ?? 4} min read</span></Link>)}</div></section>}
  </aside>;
}

function SectionTitle({ eyebrow, title, href, inverse = false }: { eyebrow: string; title: string; href: string; inverse?: boolean }) {
  return <div className="flex items-end justify-between gap-3"><div><p className={`text-[9px] font-semibold ${inverse ? "text-[#c9ff49]" : "text-[#6d8178]"}`}>{eyebrow}</p><h2 className={`mt-1 text-[17px] font-semibold ${inverse ? "text-white" : "text-[#13271f] dark:text-white"}`}>{title}</h2></div><Link href={href} aria-label={`View ${title}`} className={inverse ? "text-white/60" : "text-[#315447] dark:text-white/60"}><ArrowRight size={14} /></Link></div>;
}
