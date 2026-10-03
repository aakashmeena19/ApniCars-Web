import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, Crown, Sparkles } from "lucide-react";
import type { CarVariantOption } from "@/lib/cars/car.types";
import { getVariantPath } from "@/lib/cars/car.urls";
import { formatPrice } from "@/lib/home/home.format";

type Props = { variants: CarVariantOption[]; brandSlug: string; modelSlug: string; modelName: string };

export default function ModelRangeGuide({ variants, brandSlug, modelSlug, modelName }: Props) {
  const priced = [...variants].filter((variant) => variant.slug).sort((a, b) => Number(a.price) - Number(b.price));
  if (priced.length === 0) return null;
  const entry = priced[0];
  const topSeller = priced.find((variant) => variant.isTopSeller);
  const rangeTop = priced[priced.length - 1];
  const choices = [
    { label: "Range starts here", note: "Lowest listed ex-showroom price", variant: entry, icon: <BadgeIndianRupee size={16} /> },
    ...(topSeller && topSeller.id !== entry.id && topSeller.id !== rangeTop.id ? [{ label: "Popular configuration", note: "Marked as a top seller", variant: topSeller, icon: <Sparkles size={16} /> }] : []),
    ...(rangeTop.id !== entry.id ? [{ label: "Range-topping choice", note: "Highest listed configuration", variant: rangeTop, icon: <Crown size={16} /> }] : []),
  ];

  return <section id="range-guide"><p className="text-[10px] font-semibold text-[#688078]">Navigate the line-up</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">A quicker way into the {modelName} range</h2><p className="mt-2 max-w-[650px] text-[10px] leading-5 text-[#718078] dark:text-white/45">Start with the entry price, the popular configuration or the top end of the range.</p><div className={`mt-6 grid gap-3 ${choices.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>{choices.map((choice, index) => <Link key={choice.variant.id} href={getVariantPath(brandSlug, modelSlug, choice.variant.slug!)} className={`group flex min-h-52 flex-col rounded-[8px] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(8,31,25,.08)] ${index === 1 && choices.length === 3 ? "border-[#9dc63c] bg-[#eff7db] dark:bg-[#183224]" : "border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720]"}`}><span className="grid h-9 w-9 place-items-center rounded-[5px] bg-[#eaf2da] text-[#63800f] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]">{choice.icon}</span><p className="mt-5 text-[9px] font-semibold text-[#668078] dark:text-white/45">{choice.label}</p><h3 className="mt-2 line-clamp-2 text-[14px] font-semibold normal-case">{choice.variant.variantName}</h3><strong className="mt-2 text-[13px] text-[#315548] dark:text-[#dfff97]">{formatPrice(choice.variant.price)}</strong><div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[8px] text-[#7d8a84] dark:text-white/38"><span>{choice.note}</span><ArrowRight size={12} className="shrink-0 transition-transform group-hover:translate-x-0.5" /></div></Link>)}</div></section>;
}
