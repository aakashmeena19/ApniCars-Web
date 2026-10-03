"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type ModelSectionItem = { id: string; label: string };

export default function ModelSectionNav({ items }: { items: ModelSectionItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-150px 0px -62% 0px", threshold: [0, 0.15, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return <nav aria-label="Model sections" className="sticky top-[86px] z-40 border-y border-black/[0.08] bg-white/95 shadow-[0_8px_22px_rgba(10,35,27,.06)] backdrop-blur-xl dark:border-white/10 dark:bg-[#092019]/95">
    <div className="page-shell flex h-14 items-stretch gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-10">
      {items.map((item, index) => {
        const active = item.id === activeId;
        return <Link key={item.id} href={`#${item.id}`} onClick={() => setActiveId(item.id)} aria-current={active ? "location" : undefined} className={`relative flex shrink-0 items-center gap-2 text-[11px] font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:bg-[#9bd313] after:transition-transform ${active ? "text-[#173d31] after:scale-x-100 dark:text-white" : "text-[#66776f] after:scale-x-0 hover:text-[#173d31] dark:text-white/52 dark:hover:text-white"}`}><span className={`text-[9px] ${active ? "text-[#749c0d]" : "text-[#a3aea9] dark:text-white/25"}`}>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>;
      })}
    </div>
  </nav>;
}
