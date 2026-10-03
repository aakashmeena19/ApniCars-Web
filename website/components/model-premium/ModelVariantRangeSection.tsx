"use client";

import Link from "next/link";
import { Check, ChevronRight, Scale, X } from "lucide-react";
import { useState } from "react";

type ModelVariant = {
  id: string;
  name: string;
  transmission: string;
  price: string;
  highlights: string[];
  recommended?: boolean;
};

const variants: ModelVariant[] = [
  { id:"smart", name:"Smart", transmission:"Manual", price:"Rs. 15.00 Lakh", highlights:["6 airbags","LED projector headlamps","17-inch alloy wheels"] },
  { id:"pure", name:"Pure", transmission:"Manual", price:"Rs. 16.75 Lakh", highlights:["Connected car technology","Rear parking camera","Cruise control"] },
  { id:"pure-plus", name:"Pure Plus", transmission:"Manual", price:"Rs. 18.85 Lakh", highlights:["Panoramic sunroof","Wireless charging","Automatic headlamps"], recommended:true },
  { id:"adventure-plus", name:"Adventure Plus", transmission:"Manual / Automatic", price:"Rs. 23.64 Lakh", highlights:["360-degree camera","Terrain response","Powered driver seat"] },
  { id:"fearless", name:"Fearless", transmission:"Manual", price:"Rs. 24.25 Lakh", highlights:["Level 2 ADAS","Digital cockpit","JBL sound system"] },
  { id:"fearless-plus", name:"Fearless Plus", transmission:"Automatic", price:"Rs. 26.50 Lakh", highlights:["Ventilated front seats","Level 2 ADAS","19-inch alloy wheels"] },
];

export default function ModelVariantRangeSection() {
  const [selected, setSelected] = useState<string[]>(["pure-plus"]);

  function toggleVariant(id: string) {
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 3 ? [...current,id] : current);
  }

  const compared = variants.filter(item => selected.includes(item.id));

  return (
    <section id="variants" className="scroll-mt-14 bg-[#f3f6f3] py-14 dark:bg-[#071b16] sm:py-16">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase text-[#667b72] dark:text-white/45">Complete range</p>
            <h2 className="mt-3 text-[28px] font-semibold leading-tight text-[#0d2019] dark:text-white sm:text-[34px]">Harrier variants and prices</h2>
          </div>
          <p className="text-[10px] text-[#748078] dark:text-white/45">Select up to three variants to compare</p>
        </div>

        <div className="mt-8 grid gap-4">
          {variants.map(item => {
            const isSelected = selected.includes(item.id);
            const limitReached = selected.length === 3 && !isSelected;
            return (
              <article key={item.id} className={`overflow-hidden rounded-[8px] border bg-white dark:bg-[#102720] ${item.recommended ? "border-[#8cae25]" : "border-black/10 dark:border-white/10"}`}>
                {item.recommended && <div className="bg-[#c9ff49] px-5 py-2 text-[9px] font-bold uppercase text-[#173128]">Apnicars recommended · Best value</div>}
                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[.8fr_1.35fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-[16px] font-semibold text-[#173128] dark:text-white">{item.name}</h3><span className="rounded-full border border-black/10 px-2 py-1 text-[8px] font-semibold text-[#62736b] dark:border-white/10 dark:text-white/50">{item.transmission}</span></div>
                    <p className="mt-3 text-[15px] font-semibold text-[#173128] dark:text-white">{item.price}</p>
                    <p className="mt-1 text-[9px] text-[#7b8781] dark:text-white/40">Ex-showroom · New Delhi</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {item.highlights.map(feature => <p key={feature} className="flex gap-2 text-[10px] leading-5 text-[#586961] dark:text-white/58"><Check size={13} className="mt-1 shrink-0 text-[#789611] dark:text-[#c9ff49]"/>{feature}</p>)}
                  </div>

                  <div className="flex gap-2 sm:justify-end lg:w-[142px] lg:flex-col">
                    <Link href="/model/varient" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#173a30] px-4 text-[10px] font-semibold text-white transition-colors hover:bg-[#255347] dark:bg-[#c9ff49] dark:text-[#10271f]">View details <ChevronRight size={12}/></Link>
                    <label className={`flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-[10px] font-semibold ${isSelected ? "border-[#789611] bg-[#edf4dd] text-[#536e0b] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]" : "border-black/10 text-[#50645b] dark:border-white/15 dark:text-white/60"} ${limitReached ? "cursor-not-allowed opacity-45" : ""}`}>
                      <input type="checkbox" checked={isSelected} disabled={limitReached} onChange={()=>toggleVariant(item.id)} className="accent-[#789611]"/>Compare
                    </label>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 min-h-20 rounded-[8px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#102720] sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] bg-[#e8f1d7] text-[#68830e] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]"><Scale size={16}/></span><div><p className="text-[11px] font-semibold text-[#213a30] dark:text-white">Compare selected variants</p><p className="mt-1 text-[9px] text-[#748078] dark:text-white/42">{selected.length ? `${selected.length} of 3 selected` : "Choose variants from the range above"}</p></div></div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">{compared.map(item => <button key={item.id} type="button" onClick={()=>toggleVariant(item.id)} className="inline-flex h-8 items-center gap-2 rounded-full border border-black/10 px-3 text-[9px] font-semibold text-[#40574d] dark:border-white/15 dark:text-white/65">{item.name}<X size={11}/></button>)}<button type="button" disabled={selected.length<2} className="h-9 rounded-full bg-[#173a30] px-5 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35 dark:bg-[#c9ff49] dark:text-[#10271f]">Compare now</button></div>
        </div>
      </div>
    </section>
  );
}

