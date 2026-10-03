"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Download, GitCompareArrows, IndianRupee, Share2 } from "lucide-react";

export default function VariantActionPanel({ name, price }: { name: string; price: string }) {
  const [shared, setShared] = useState(false);
  async function share() {
    if (navigator.share) await navigator.share({ title: name, url: window.location.href });
    else await navigator.clipboard.writeText(window.location.href);
    setShared(true);
    window.setTimeout(() => setShared(false), 1800);
  }
  return <aside className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0c2b22] text-white shadow-[0_20px_45px_rgba(4,25,19,.2)]">
    <div className="border-b border-white/10 p-5"><p className="text-[9px] font-semibold text-[#c9ff49]">Your selected configuration</p><h3 className="mt-2 text-[16px] font-semibold leading-5 normal-case">{name}</h3><p className="mt-4 text-[9px] text-white/45">Ex-showroom price</p><strong className="mt-1 block text-[22px] font-semibold text-[#dfff97]">{price}</strong></div>
    <div className="grid gap-2 p-4"><Link href="/emi-calculator" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] bg-[#c9ff49] px-4 text-[10px] font-semibold text-[#10271f]"><IndianRupee size={14} /> Calculate EMI</Link><Link href="/compare" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] border border-white/20 px-4 text-[9px] font-semibold text-white"><GitCompareArrows size={13} /> Compare variant</Link><button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] border border-white/20 px-4 text-[9px] font-semibold"><Download size={13} /> Save specification sheet</button><button type="button" onClick={() => void share()} className="inline-flex min-h-10 items-center justify-center gap-2 text-[9px] font-semibold text-white/70">{shared ? <Check size={13} /> : <Share2 size={13} />}{shared ? "Link copied" : "Share this variant"}</button></div>
    <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4 text-[9px] leading-4 text-white/42">Price excludes registration, insurance and city-specific charges.</div>
  </aside>;
}
