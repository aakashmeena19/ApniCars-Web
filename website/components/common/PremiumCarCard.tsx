import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

type PremiumCarCardProps = {
  name: string;
  meta: string;
  price: string;
  image: string;
  href?: string;
  badge?: string;
  badgeTone?: "lime" | "warm";
};

export default function PremiumCarCard({ name, meta, price, image, href = "/cars", badge, badgeTone = "lime" }: PremiumCarCardProps) {
  return (
    <article className="group overflow-hidden rounded-[8px] border border-black/[0.08] bg-white shadow-[0_8px_24px_rgba(8,31,25,.065)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9db77c] hover:shadow-[0_15px_34px_rgba(8,31,25,.11)] dark:border-white/10 dark:bg-[#102720] dark:hover:border-[#c9ff49]/35">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9eeeb]">
        <Image src={image} alt={`${name} exterior`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {badge ? <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${badgeTone === "warm" ? "bg-[#f08a4b] text-white" : "bg-[#c9ff49] text-[#183128]"}`}>{badge}</span> : <span />}
          <button type="button" aria-label={`Save ${name}`} className="grid h-8 w-8 place-items-center rounded-full border border-white/75 bg-white/85 text-[#33483f] shadow-sm backdrop-blur-md transition-colors hover:text-[#d54b58]"><Heart size={14} /></button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 h-8 w-0.5 shrink-0 rounded-full bg-[#9aba30] dark:bg-[#c9ff49]" />
          <div className="min-w-0"><p className="truncate text-[10px] font-medium text-[#74817b] dark:text-white/48">{meta}</p><h3 className="mt-1 truncate text-[15px] font-semibold text-[#15251e] dark:text-white">{name}</h3></div>
        </div>

        <div className="mt-2.5 flex items-end justify-between gap-3 border-t border-black/[0.07] pt-2.5 dark:border-white/10">
          <div><p className="text-[9px] text-[#85908b] dark:text-white/40">Price range</p><p className="mt-0.5 text-[14px] font-semibold text-[#18332a] dark:text-white">{price}</p></div>
          <Link href={href} aria-label={`View ${name}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#adc29f] text-[#31584b] transition-all group-hover:border-[#173a30] group-hover:bg-[#173a30] group-hover:text-white dark:border-white/20 dark:text-white dark:group-hover:border-[#c9ff49] dark:group-hover:bg-[#c9ff49] dark:group-hover:text-[#14281f]"><ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </article>
  );
}
