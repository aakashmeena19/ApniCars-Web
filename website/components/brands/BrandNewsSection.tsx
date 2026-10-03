import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { BrandNewsStory } from "@/lib/brands/brand.types";
import { getPublicUploadUrl } from "@/lib/home/home.api";

export default function BrandNewsSection({
  brandName,
  stories,
}: {
  brandName: string;
  stories: BrandNewsStory[];
}) {
  if (stories.length === 0) return null;

  return (
    <section
      id="brand-news"
      className="scroll-mt-32 border-t border-black/[0.07] bg-[#f3f6f4] py-14 dark:border-white/10 dark:bg-[#081b16] sm:py-16"
    >
      <div className="page-shell">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#698078]">Latest updates</p>
        <h2 className="mt-2 text-[27px] font-semibold text-[#0d1d17] dark:text-white sm:text-[32px]">
          {brandName} news and insights
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <article key={story.id} className="group overflow-hidden rounded-[8px] border border-black/[0.07] bg-white dark:border-white/10 dark:bg-[#102720]">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#dfe6e2]">
                <Image
                  src={getPublicUploadUrl(story.coverImageUrl) ?? "/images/hero-light-premium.png"}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-[9px] font-semibold uppercase text-[#638070]">
                  <span>{story.category.name}</span>
                  {story.readTimeMinutes && (
                    <span className="flex items-center gap-1 normal-case text-[#89938e]">
                      <Clock3 size={11} />
                      {story.readTimeMinutes} min
                    </span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug text-[#14261f] dark:text-white">{story.title}</h3>
                <Link href={`/news/${story.slug}`} className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold text-[#285446] dark:text-[#dfff97]">
                  Read story <ArrowUpRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
