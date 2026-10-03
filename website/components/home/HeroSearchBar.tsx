"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeIndianRupee, CarFront, Fuel, Shapes } from "lucide-react";
import type { HomeBodyType, HomeBrand } from "@/lib/home/home.types";

type FilterKey = "brand" | "budget" | "fuel" | "bodyType";
const initialValues: Record<FilterKey, string> = { brand: "", budget: "", fuel: "", bodyType: "" };

export default function HeroSearchBar({ brands, bodyTypes }: { brands: HomeBrand[]; bodyTypes: HomeBodyType[] }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const filters = useMemo(() => [
    { key: "brand" as const, label: "Brand", icon: CarFront, options: [{ label: "All brands", value: "" }, ...brands.map((brand) => ({ label: brand.name, value: brand.slug }))] },
    { key: "budget" as const, label: "Choose budget", icon: BadgeIndianRupee, options: [{ label: "Any budget", value: "" }, { label: "Under Rs. 8 lakh", value: "0-800000" }, { label: "Rs. 8 - 15 lakh", value: "800000-1500000" }, { label: "Rs. 15 - 25 lakh", value: "1500000-2500000" }, { label: "Above Rs. 25 lakh", value: "2500000+" }] },
    { key: "fuel" as const, label: "Fuel type", icon: Fuel, options: ["", "Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map((value) => ({ label: value || "All fuels", value: value.toLowerCase() })) },
    { key: "bodyType" as const, label: "Body type", icon: Shapes, options: [{ label: "All body types", value: "" }, ...bodyTypes.map((type) => ({ label: type.name, value: type.slug }))] },
  ], [brands, bodyTypes]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams(Object.entries(values).filter(([, value]) => value)).toString();
    router.push(query ? `/cars?${query}` : "/cars");
  }

  return <form onSubmit={handleSearch} aria-label="Search cars" className="grid grid-cols-2 gap-1.5 rounded-[12px] border border-white/70 bg-white/95 p-2.5 text-[#14221c] shadow-[0_18px_48px_rgba(0,0,0,.22)] backdrop-blur-xl lg:grid-cols-[1.12fr_1.05fr_.82fr_1fr_auto]">{filters.map((filter) => { const Icon = filter.icon; return <label key={filter.key} className="group flex h-[64px] min-w-0 items-center gap-3 rounded-[9px] px-3 transition-colors hover:bg-[#f0f4f1] focus-within:bg-[#f0f4f1]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eaf1ed] text-[#315b4f]"><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-medium text-[#7b8983]">{filter.label}</span><select value={values[filter.key]} onChange={(event) => setValues((current) => ({ ...current, [filter.key]: event.target.value }))} className="mt-1 w-full appearance-auto bg-transparent pr-1 text-[11px] font-semibold text-[#172820] outline-none">{filter.options.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}</select></span></label>; })}<button type="submit" className="flex h-[64px] items-center justify-center gap-2 rounded-[9px] bg-[#082d26] px-7 text-[11px] font-semibold text-white transition-colors hover:bg-[#061f1b] sm:col-span-2 lg:col-span-1">Search Cars <ArrowRight size={14} /></button></form>;
}

