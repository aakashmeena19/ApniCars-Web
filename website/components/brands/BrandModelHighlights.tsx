import Link from "next/link";
import { ArrowUpRight, BatteryCharging, Gauge, Users } from "lucide-react";
import type { HomeCar } from "@/lib/home/home.types";
import { getModelPath } from "@/lib/cars/car.urls";

export default function BrandModelHighlights({ brandName, cars }: { brandName: string; cars: HomeCar[] }) {
  const usefulCars = cars.filter((car) => car.specs && getHighlights(car).length > 0).slice(0, 4);
  if (usefulCars.length === 0) return null;
  return <section id="highlights" className="bg-white py-10 dark:bg-[#0a1d18] sm:py-12"><div className="page-shell"><p className="text-[9px] font-semibold text-[#698078]">At-a-glance specifications</p><h2 className="mt-1 text-[23px] font-semibold sm:text-[27px]">{brandName} model highlights</h2><div className="mt-6 grid gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">{usefulCars.map((car) => <Link key={car.id} href={getModelPath(car.brand.slug, car.slug)} className="group bg-white p-4 dark:bg-[#102720]"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] text-[#718079]">{car.bodyType?.name ?? "Model"}</p><h3 className="mt-1 text-[13px] font-semibold">{car.brand.name} {car.name}</h3></div><ArrowUpRight size={13} className="text-[#668078]" /></div><div className="mt-4 grid gap-2">{getHighlights(car).slice(0, 3).map((item) => <span key={item.label} className="flex items-center gap-2 text-[9px] text-[#607169] dark:text-white/55">{item.icon}<strong className="font-semibold text-[#253b32] dark:text-white/80">{item.value}</strong>{item.label}</span>)}</div></Link>)}</div></div></section>;
}

function getHighlights(car: HomeCar) {
  const specs = car.specs;
  if (!specs) return [];
  return [
    specs.seatingCapacity ? { label: "seats", value: String(specs.seatingCapacity), icon: <Users size={11} /> } : null,
    specs.range ? { label: "range", value: `${specs.range} km`, icon: <BatteryCharging size={11} /> } : null,
    specs.mileage ? { label: "mileage", value: `${specs.mileage} km/l`, icon: <Gauge size={11} /> } : null,
    specs.engineCc ? { label: "engine", value: `${specs.engineCc} cc`, icon: <Gauge size={11} /> } : null,
    specs.powerPs ? { label: "power", value: `${specs.powerPs} PS`, icon: <Gauge size={11} /> } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}
