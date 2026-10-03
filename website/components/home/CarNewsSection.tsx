import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import type { HomeNewsStory } from "@/lib/home/home.types";

export default function CarNewsSection({ stories }: { stories: HomeNewsStory[] }) {
  if (stories.length === 0) return null;
  return <section className="bg-[#f4f6f4] py-12 dark:bg-[#081b16] sm:py-14 lg:py-16"><div className="page-shell"><div className="flex items-end justify-between gap-6"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#698078]">From the newsroom</p><h2 className="mt-2 text-[27px] font-semibold text-[#0c1a15] dark:text-white sm:text-[32px]">Stories for the road ahead</h2><p className="mt-3 max-w-[520px] text-[11px] leading-5 text-[#68746e] dark:text-white/55">Fresh perspectives, useful buying advice and the cars shaping your next drive.</p></div><Link href="/news" className="hidden items-center gap-2 text-[10px] font-semibold text-[#31574b] dark:text-white/70 sm:flex">View all news <ArrowRight size={13} /></Link></div><div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{stories.map((story, index) => <NewsCard key={story.id} story={story} featured={index === 0} />)}</div></div></section>;
}

function NewsCard({ story, featured }: { story: HomeNewsStory; featured: boolean }) {
  const image = getPublicUploadUrl(story.coverImageUrl) ?? "/images/hero-light-premium.png";
  return <article className={`group relative isolate min-h-[280px] overflow-hidden rounded-[7px] bg-[#0a211b] shadow-[0_12px_30px_rgba(8,31,25,.11)] ${featured ? "md:col-span-2 lg:col-span-1" : ""}`}><Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,16,.05)_15%,rgba(4,20,16,.20)_48%,rgba(4,20,16,.90)_100%)]" /><Link href={`/news/${story.slug}`} aria-label={`Read ${story.title}`} className="absolute inset-0 z-10" /><div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end gap-4 p-5 sm:p-6"><div className="min-w-0 flex-1"><div className="flex items-center gap-3 text-[9px] font-semibold text-[#c9ff49]"><span className="uppercase">{story.category.name}</span>{story.readTimeMinutes && <span className="flex items-center gap-1.5 text-white/58"><Clock3 size={11} />{story.readTimeMinutes} min read</span>}</div><h3 className="mt-2 text-[19px] font-semibold leading-[1.18] text-white sm:text-[22px]">{story.title}</h3></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 text-white group-hover:bg-[#c9ff49] group-hover:text-[#10271f]"><ArrowUpRight size={15} /></span></div></article>;
}

