"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SliderArrows({ onPrevious, onNext }: { onPrevious: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center gap-0.5" aria-label="Carousel controls">
      <button type="button" onClick={onPrevious} aria-label="Show previous card" className="grid h-7 w-7 place-items-center text-[#46645a] transition-all hover:-translate-x-0.5 hover:text-[#6f8c0c] dark:text-white/65 dark:hover:text-[#c9ff49]"><ArrowLeft size={14} strokeWidth={2} /></button>
      <span className="h-3 w-px bg-black/10 dark:bg-white/15" />
      <button type="button" onClick={onNext} aria-label="Show next card" className="grid h-7 w-7 place-items-center text-[#46645a] transition-all hover:translate-x-0.5 hover:text-[#6f8c0c] dark:text-white/65 dark:hover:text-[#c9ff49]"><ArrowRight size={14} strokeWidth={2} /></button>
    </div>
  );
}
