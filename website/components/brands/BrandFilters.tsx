"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { BrandCarsFilters } from "@/lib/brands/brand.types";

type Props = {
  filters: BrandCarsFilters;
  activeBodyTypes: string[];
  activeFuelTypes: string[];
  minPrice?: string;
  maxPrice?: string;
};

export default function BrandFilters({ filters, activeBodyTypes, activeFuelTypes, minPrice, maxPrice }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasFilters = activeBodyTypes.length > 0 || activeFuelTypes.length > 0 || Boolean(minPrice || maxPrice);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => value ? params.set(key, value) : params.delete(key));
    params.delete("page");
    router.push(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function toggleValue(key: "bodyType" | "fuelType", value: string, active: string[]) {
    const next = active.includes(value) ? active.filter((item) => item !== value) : [...active, value];
    updateParams({ [key]: next.length ? next.join(",") : null });
  }

  return (
    <div className="rounded-[7px] border border-black/[0.08] bg-white p-4 shadow-[0_8px_22px_rgba(8,31,25,.045)] dark:border-white/10 dark:bg-[#102720]">
      <div className="flex items-center justify-between gap-3 border-b border-black/[0.07] pb-4 dark:border-white/10">
        <div className="flex items-center gap-2"><SlidersHorizontal size={14} /><h2 className="text-[12px] font-semibold">Refine results</h2></div>
        {hasFilters && <button type="button" onClick={() => updateParams({ bodyType: null, fuelType: null, minPrice: null, maxPrice: null })} className="flex items-center gap-1 text-[9px] font-semibold text-[#557168] hover:text-[#16382e]"><X size={12} /> Clear</button>}
      </div>

      {filters.bodyTypes.length > 0 && <FilterGroup title="Body style">{filters.bodyTypes.map((item) => <FilterCheck key={item.slug} label={item.name} count={item.count} checked={activeBodyTypes.includes(item.slug)} onChange={() => toggleValue("bodyType", item.slug, activeBodyTypes)} />)}</FilterGroup>}
      {filters.fuelTypes.length > 0 && <FilterGroup title="Fuel type">{filters.fuelTypes.map((item) => <FilterCheck key={item.value} label={item.label} count={item.count} checked={activeFuelTypes.includes(item.value)} onChange={() => toggleValue("fuelType", item.value, activeFuelTypes)} />)}</FilterGroup>}

      <FilterGroup title="Budget">
        <div className="grid gap-2">
          <BudgetButton label="Under Rs. 20 Lakh" active={!minPrice && maxPrice === "2000000"} onClick={() => updateParams({ minPrice: null, maxPrice: "2000000" })} />
          <BudgetButton label="Rs. 20 - 50 Lakh" active={minPrice === "2000000" && maxPrice === "5000000"} onClick={() => updateParams({ minPrice: "2000000", maxPrice: "5000000" })} />
          <BudgetButton label="Above Rs. 50 Lakh" active={minPrice === "5000000" && !maxPrice} onClick={() => updateParams({ minPrice: "5000000", maxPrice: null })} />
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="border-b border-black/[0.07] py-4 last:border-b-0 last:pb-0 dark:border-white/10"><legend className="mb-2.5 text-[9px] font-semibold text-[#6b7c75]">{title}</legend><div className="grid gap-2">{children}</div></fieldset>;
}

function FilterCheck({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return <label className="flex cursor-pointer items-center gap-2.5 text-[11px] text-[#34483f] dark:text-white/72"><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#1d5a48]" /><span className="flex-1">{label}</span><span className="text-[9px] text-[#8b9691]">{count}</span></label>;
}

function BudgetButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-[6px] border px-3 py-2.5 text-left text-[10px] transition-colors ${active ? "border-[#1d5a48] bg-[#edf5f0] font-semibold text-[#16382e] dark:border-[#c9ff49]/50 dark:bg-[#c9ff49]/10 dark:text-[#dfff97]" : "border-black/[0.08] text-[#53645d] hover:border-[#8ba69b] dark:border-white/10 dark:text-white/60"}`}>{label}</button>;
}
