"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { variants } from "@/components/model/modelData";

export default function ModelVariantsSection() {
  const [selectedVariant, setSelectedVariant] = useState(variants[1].name);

  return (
    <section className="bg-[#f3f6f3] py-12 dark:bg-[#071b16] sm:py-14 lg:py-16">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6b837a]">Variants and pricing</p>
            <h2 className="mt-2 text-[27px] font-semibold text-[#0c1a15] dark:text-white sm:text-[32px]">Choose the right Harrier</h2>
          </div>
          <p className="max-w-[390px] text-[10px] leading-5 text-[#69766f] dark:text-white/50">Indicative ex-showroom prices. Equipment and availability can change by city and model year.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {variants.map((variant) => {
            const selected = selectedVariant === variant.name;
            return (
              <button key={variant.name} type="button" onClick={() => setSelectedVariant(variant.name)} aria-pressed={selected} className={`group min-h-[205px] rounded-[8px] border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(7,30,24,.08)] ${selected ? "border-[#89a629] bg-[#102f27] text-white shadow-[0_12px_30px_rgba(7,30,24,.12)]" : "border-black/[0.08] bg-white text-[#172a23] dark:border-white/10 dark:bg-[#102720] dark:text-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div><p className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${selected ? "text-[#c9ff49]" : "text-[#71817a] dark:text-white/45"}`}>Diesel</p><h3 className="mt-2 text-[17px] font-semibold">{variant.name}</h3></div>
                  <span className={`grid h-7 w-7 place-items-center rounded-full border ${selected ? "border-[#c9ff49] bg-[#c9ff49] text-[#153128]" : "border-black/10 text-[#63766e] group-hover:border-[#8aa62b] dark:border-white/15 dark:text-white/55"}`}>{selected ? <Check size={13} /> : <ChevronRight size={13} />}</span>
                </div>
                <p className={`mt-3 min-h-[40px] text-[10px] leading-5 ${selected ? "text-white/60" : "text-[#6d7973] dark:text-white/50"}`}>{variant.note}</p>
                <div className={`mt-4 border-t pt-4 ${selected ? "border-white/12" : "border-black/[0.07] dark:border-white/10"}`}><p className={`text-[9px] ${selected ? "text-white/45" : "text-[#84908a] dark:text-white/40"}`}>{variant.transmission}</p><p className="mt-1 text-[14px] font-semibold">{variant.price}</p></div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/[0.08] pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-[#67756e] dark:text-white/50"><span className="font-semibold text-[#2f4d42] dark:text-white">{selectedVariant}</span> selected for comparison.</p>
          <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#496e61] px-5 text-[10px] font-semibold text-[#31584b] transition-colors hover:bg-[#14382e] hover:text-white dark:border-white/25 dark:text-white dark:hover:border-[#c9ff49] dark:hover:bg-[#c9ff49] dark:hover:text-[#11281f]">Compare selected variant <ChevronRight size={13} /></button>
        </div>
      </div>
    </section>
  );
}
