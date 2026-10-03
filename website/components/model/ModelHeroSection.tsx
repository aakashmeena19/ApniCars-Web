"use client";

import Image from "next/image";
import { ChevronDown, Heart, MapPin, Share2, Star } from "lucide-react";
import { useState } from "react";
import { colors, model, quickSpecs, variants } from "@/components/model/modelData";

export default function ModelHeroSection() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState(variants[1].name);

  return (
    <section className="border-b border-black/[0.07] bg-[#f1f5f2] dark:border-white/10 dark:bg-[#071b16]">
      <div className="page-shell pb-10 pt-7 sm:pb-12 lg:pb-14">
        <p className="text-[10px] font-medium text-[#718078] dark:text-white/45">Cars &nbsp;/&nbsp; Tata &nbsp;/&nbsp; Harrier</p>

        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#627d73] dark:text-[#a7c2b9]">{model.brand}</p>
              <span className="rounded-full border border-[#abc797] bg-white/70 px-2.5 py-1 text-[9px] font-semibold text-[#385a4e] dark:border-[#c9ff49]/30 dark:bg-white/[0.05] dark:text-[#c9ff49]">Premium SUV</span>
            </div>
            <h1 className="mt-2 text-[38px] font-semibold leading-none text-[#0b1d17] dark:text-white sm:text-[48px]">{model.name}</h1>
            <p className="mt-3 text-[13px] text-[#62716b] dark:text-white/58">{model.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-9 items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 text-[10px] font-semibold text-[#263e35] dark:border-white/10 dark:bg-white/[0.05] dark:text-white"><Star size={13} fill="#86a51a" className="text-[#86a51a]" /> {model.rating} <span className="font-normal text-[#84908a] dark:text-white/40">{model.reviewCount}</span></span>
            <button type="button" aria-label="Save Tata Harrier" title="Save model" className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.09] bg-white text-[#3f5b51] transition-colors hover:border-[#95ad3c] hover:text-[#73900f] dark:border-white/12 dark:bg-white/[0.05] dark:text-white/65 dark:hover:text-[#c9ff49]"><Heart size={15} /></button>
            <button type="button" aria-label="Share Tata Harrier" title="Share model" className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.09] bg-white text-[#3f5b51] transition-colors hover:border-[#95ad3c] hover:text-[#73900f] dark:border-white/12 dark:bg-white/[0.05] dark:text-white/65 dark:hover:text-[#c9ff49]"><Share2 size={15} /></button>
          </div>
        </div>

        <div className="mt-7 grid overflow-hidden rounded-[8px] border border-black/[0.07] bg-white shadow-[0_18px_48px_rgba(7,30,24,.08)] dark:border-white/10 dark:bg-[#0d251f] lg:grid-cols-[1.55fr_.75fr]">
          <div className="relative min-h-[330px] overflow-hidden bg-[#e7eeea] sm:min-h-[430px] lg:min-h-[500px]" style={{ backgroundColor: `${selectedColor.value}18` }}>
            <Image src={model.heroImage} alt="Tata Harrier exterior" fill priority sizes="(max-width: 1024px) 100vw, 68vw" className="object-cover object-center transition-transform duration-700" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 sm:bottom-6 sm:left-7 sm:right-7">
              <div className="rounded-[6px] border border-white/40 bg-white/88 px-4 py-3 text-[#163027] shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-[#082019]/82 dark:text-white">
                <p className="text-[9px] font-medium text-[#667a72] dark:text-white/48">Selected colour</p>
                <p className="mt-1 text-[12px] font-semibold">{selectedColor.name}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/50 bg-white/88 p-2 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-[#082019]/82">
                {colors.map((color) => <button key={color.name} type="button" onClick={() => setSelectedColor(color)} aria-label={`Select ${color.name}`} aria-pressed={selectedColor.name === color.name} className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor.name === color.name ? "border-[#c9ff49] ring-2 ring-black/15 dark:ring-white/20" : "border-white"}`} style={{ backgroundColor: color.value }} />)}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-black/[0.07] px-6 py-7 dark:border-white/10 sm:px-8 lg:border-l lg:border-t-0 lg:px-9">
            <p className="text-[10px] text-[#75827c] dark:text-white/45">{model.priceNote}</p>
            <p className="mt-1 text-[24px] font-semibold text-[#10271f] dark:text-white">{model.price}</p>
            <p className="mt-2 text-[10px] leading-5 text-[#7b8681] dark:text-white/45">Final on-road price depends on variant, city, registration and insurance.</p>

            <label className="mt-6 grid gap-2 text-[10px] font-semibold text-[#40574e] dark:text-white/70">
              Choose variant
              <span className="relative">
                <select value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)} className="h-11 w-full appearance-none rounded-[6px] border border-[#d6dfda] bg-white px-3 pr-9 text-[11px] font-semibold text-[#173128] outline-none focus:border-[#7e9b24] dark:border-white/12 dark:bg-[#102e26] dark:text-white">
                  {variants.map((variant) => <option key={variant.name}>{variant.name}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#607169] dark:text-white/55" />
              </span>
            </label>

            <label className="mt-4 grid gap-2 text-[10px] font-semibold text-[#40574e] dark:text-white/70">
              Your city
              <span className="relative flex h-11 items-center rounded-[6px] border border-[#d6dfda] bg-white px-3 dark:border-white/12 dark:bg-[#102e26]">
                <MapPin size={14} className="text-[#70827a] dark:text-white/45" />
                <select defaultValue="New Delhi" className="h-full min-w-0 flex-1 appearance-none bg-transparent px-2 text-[11px] font-semibold text-[#173128] outline-none dark:text-white">
                  <option>New Delhi</option><option>Mumbai</option><option>Jaipur</option><option>Pune</option><option>Bengaluru</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none text-[#607169] dark:text-white/55" />
              </span>
            </label>

            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button type="button" className="h-11 rounded-full bg-[#c9ff49] px-4 text-[11px] font-bold text-[#10271f] transition-all hover:-translate-y-px hover:bg-[#bced3e]">Get on-road price</button>
              <button type="button" className="h-11 rounded-full border border-[#315c4f] px-4 text-[11px] font-semibold text-[#254b3f] transition-colors hover:bg-[#12372d] hover:text-white dark:border-white/25 dark:text-white dark:hover:border-[#c9ff49] dark:hover:bg-[#c9ff49] dark:hover:text-[#10271f]">Book test drive</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-x border-b border-black/[0.07] bg-white dark:border-white/10 dark:bg-[#0d251f] sm:grid-cols-5">
          {quickSpecs.map((spec) => <div key={spec.label} className="border-r border-t border-black/[0.07] px-4 py-4 last:border-r-0 dark:border-white/10 sm:border-t-0"><p className="text-[9px] text-[#7b8882] dark:text-white/40">{spec.label}</p><p className="mt-1 text-[12px] font-semibold text-[#1a3027] dark:text-white">{spec.value}</p></div>)}
        </div>
      </div>
    </section>
  );
}
