import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, CarFront, Gauge, GitCompareArrows, Users } from "lucide-react";
import type { CarDetail } from "@/lib/cars/car.types";
import type { HomeCar } from "@/lib/home/home.types";
import { getModelPath } from "@/lib/cars/car.urls";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";

export default function ModelRivalComparison({ car, rivals }: { car: CarDetail; rivals: HomeCar[] }) {
  if (rivals.length === 0) return null;
  const selected = car.selectedVariant;
  const current = {
    id: car.id,
    name: `${car.brand.name} ${car.name}`,
    image: getPublicUploadUrl(car.coverImageUrl ?? car.images[0]?.imageUrl),
    price: formatPriceRange(car),
    powertrain: selected?.isElectric
      ? selected.electric?.batteryCapacity ? `${selected.electric.batteryCapacity} kWh` : "Electric"
      : selected?.ice?.displacementCc ? `${selected.ice.displacementCc} cc` : "See variants",
    range: selected?.isElectric ? selected.electric?.claimedRange ? `${selected.electric.claimedRange} km` : null : selected?.ice?.claimedFe ? `${selected.ice.claimedFe} km/l` : null,
    seats: selected?.seatingCapacity ? `${selected.seatingCapacity} seats` : null,
    href: `#variants`,
    selected: true,
  };
  const candidates = rivals.slice(0, 2).map((rival) => ({
    id: rival.id,
    name: `${rival.brand.name} ${rival.name}`,
    image: getPublicUploadUrl(rival.coverImageUrl),
    price: formatPriceRange(rival),
    powertrain: rival.isElectric ? rival.specs?.batteryCapacity ? `${rival.specs.batteryCapacity} kWh` : "Electric" : rival.specs?.engineCc ? `${rival.specs.engineCc} cc` : "See model",
    range: rival.isElectric ? rival.specs?.range ? `${rival.specs.range} km` : null : rival.specs?.mileage ? `${rival.specs.mileage} km/l` : null,
    seats: rival.specs?.seatingCapacity ? `${rival.specs.seatingCapacity} seats` : null,
    href: getModelPath(rival.brand.slug, rival.slug),
    selected: false,
  }));

  return <section id="compare-rivals"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold text-[#688078]">Market context</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Compare {car.name} with close rivals</h2><p className="mt-2 max-w-[640px] text-[10px] leading-5 text-[#718078] dark:text-white/45">A quick model-level snapshot using price and core powertrain information.</p></div><Link href="/compare" className="inline-flex min-h-10 items-center gap-2 rounded-[5px] bg-[#173d31] px-4 text-[9px] font-semibold text-white dark:bg-[#c9ff49] dark:text-[#173127]"><GitCompareArrows size={13} /> Open full comparison</Link></div><div className="mt-6 grid overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] md:grid-cols-3 dark:border-white/10 dark:bg-white/10">{[current, ...candidates].map((item) => <article key={item.id} className={`group flex min-w-0 flex-col bg-white p-5 dark:bg-[#102720] ${item.selected ? "relative md:-my-px md:border-y-2 md:border-[#a8d92d]" : ""}`}><div className="flex items-center justify-between gap-3"><span className={`text-[8px] font-semibold ${item.selected ? "text-[#63800f] dark:text-[#dfff97]" : "text-[#75857d]"}`}>{item.selected ? "Selected model" : "Close rival"}</span>{item.selected && <span className="rounded-full bg-[#c9ff49] px-2 py-1 text-[7px] font-semibold text-[#173127]">Current</span>}</div><div className="relative mt-4 aspect-[16/9] bg-[#edf2ef] dark:bg-white/5">{item.image ? <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 28vw" className="object-contain p-3" /> : <CarFront size={30} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#71837b]" />}</div><h3 className="mt-4 text-[14px] font-semibold">{item.name}</h3><strong className="mt-1 text-[11px] text-[#315548] dark:text-[#dfff97]">{item.price}</strong><div className="mt-4 grid gap-2 border-t border-black/[0.07] pt-4 text-[9px] text-[#687870] dark:border-white/10 dark:text-white/50"><span className="flex items-center gap-2"><Gauge size={12} />{item.powertrain}</span>{item.range && <span className="flex items-center gap-2"><BatteryCharging size={12} />{item.range}</span>}{item.seats && <span className="flex items-center gap-2"><Users size={12} />{item.seats}</span>}</div><Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#315548] dark:text-[#dfff97]">{item.selected ? "Explore variants" : "View model"} <ArrowRight size={11} /></Link></article>)}</div></section>;
}
