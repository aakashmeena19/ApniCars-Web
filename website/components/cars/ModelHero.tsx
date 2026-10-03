"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Camera, CarFront, ChevronRight, CircleGauge, Fuel, Gauge, GitCompareArrows, Users } from "lucide-react";
import type { CarDetail } from "@/lib/cars/car.types";
import { getBrandCarsPath, getModelPhotosPath } from "@/lib/cars/car.urls";
import { formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import Model360PreviewLink from "./Model360PreviewLink";

export default function ModelHero({ car }: { car: CarDetail }) {
  const selected = car.selectedVariant;
  const title = `${car.brand.name} ${car.name}`;
  const brandLogo = getPublicUploadUrl(car.brand.logoUrl);
  const images = useMemo(() => {
    const candidates = [car.coverImageUrl, ...car.images.map((image) => image.imageUrl)]
      .map(getPublicUploadUrl)
      .filter((image): image is string => Boolean(image));
    return [...new Set(candidates)].slice(0, 5);
  }, [car.coverImageUrl, car.images]);
  const [activeImage, setActiveImage] = useState(0);
  const heroImage = images[activeImage] ?? "/images/hero-car.png";
  const highlights = getHeroHighlights(car);
  const description = getModelDescription(car);

  return <section className="overflow-hidden border-b border-black/[0.08] bg-[#edf2ef] text-[#10231b] dark:border-white/10 dark:bg-[#091f18] dark:text-white">
    <div className="page-shell py-4"><nav className="flex items-center gap-1.5 overflow-hidden text-[9px] text-[#65766e] dark:text-white/42"><Link href="/brands">Brands</Link><ChevronRight size={10} className="shrink-0" /><Link href={getBrandCarsPath(car.brand.slug)}>{car.brand.name}</Link><ChevronRight size={10} className="shrink-0" /><span className="truncate">{car.name}</span></nav></div>

    <div className="page-shell grid gap-7 pb-7 lg:grid-cols-2 lg:items-stretch lg:pb-8">
      <div className="flex flex-col justify-center py-4 lg:min-h-[430px] lg:py-5">
        <div className="flex items-center gap-3">{brandLogo ? <span className="relative h-11 w-11 overflow-hidden rounded-full border border-black/10 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-white/90"><Image src={brandLogo} alt={`${car.brand.name} logo`} fill sizes="44px" className="object-contain p-1.5" /></span> : <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#537267] dark:bg-white/5"><CarFront size={18} /></span>}<div><p className="text-[10px] font-semibold text-[#315548] dark:text-[#dfff97]">{car.brand.name}</p><p className="mt-0.5 text-[9px] text-[#78867f] dark:text-white/38">{car.bodyType?.name ?? "New car"} model overview</p></div></div>
        <h1 className="mt-5 text-[42px] font-semibold leading-[0.98] sm:text-[50px] lg:text-[54px]">{car.name}</h1>
        <p className="mt-3 text-[16px] font-medium text-[#294b3f] dark:text-white/78">{selected?.isElectric ? "Electric capability, configured for real journeys" : `${car.bodyType?.name ?? "Car"} capability for everyday driving`}</p>
        <p className="mt-4 max-w-[570px] text-[11px] leading-6 text-[#5b6d65] dark:text-white/52">{description}</p>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">{highlights.map((item) => <div key={item.label} className="min-w-0 border-l border-black/10 pl-3 first:border-l-0 first:pl-0 dark:border-white/10"><span className="text-[#42675a] dark:text-[#c9ff49]">{item.icon}</span><strong className="mt-2 block truncate text-[11px] font-semibold">{item.value}</strong><small className="mt-0.5 block text-[8px] text-[#78867f] dark:text-white/35">{item.label}</small></div>)}</div>

        <div className="mt-5 border-t border-black/[0.08] pt-4 dark:border-white/10"><p className="text-[9px] text-[#74827b] dark:text-white/38">Ex-showroom price range</p><strong className="mt-1 block text-[22px] font-semibold text-[#173d31] dark:text-[#dfff97]">{formatPriceRange(car)}</strong></div>
        <div className="mt-4 flex flex-wrap gap-2"><Link href="#variants" className="inline-flex min-h-11 items-center gap-3 rounded-[5px] bg-[#baff28] px-5 text-[10px] font-semibold text-[#11261e] shadow-[0_10px_24px_rgba(126,170,22,.18)]">View variants <ArrowRight size={13} /></Link><Link href="/compare" className="inline-flex min-h-11 items-center gap-3 rounded-[5px] border border-[#29483d]/25 bg-white/70 px-5 text-[10px] font-semibold text-[#1d3b31] dark:border-white/15 dark:bg-white/5 dark:text-white"><GitCompareArrows size={13} /> Compare</Link><Link href={getModelPhotosPath(car.brand.slug, car.slug)} className="inline-flex min-h-11 items-center gap-3 rounded-[5px] border border-[#29483d]/15 px-4 text-[10px] font-semibold text-[#315548] dark:border-white/10 dark:text-white/70"><Camera size={13} /> Photos</Link>{car.has360View && <Model360PreviewLink brandSlug={car.brand.slug} modelSlug={car.slug} title={title} />}</div>
      </div>

      <div className="relative min-h-[340px] overflow-hidden rounded-[8px] border border-black/[0.08] bg-[#dce6e1] dark:border-white/10 dark:bg-[#123128] sm:min-h-[390px] lg:min-h-[430px]">
        <div className="absolute right-5 top-5 z-20 rounded-[4px] border border-white/50 border-t-2 border-t-[#a9e327] bg-white/70 px-3 py-2 text-[10px] font-semibold text-[#173d31]/75 shadow-sm backdrop-blur dark:border-white/10 dark:border-t-[#c9ff49] dark:bg-[#081c16]/70 dark:text-white/65">Apni Cars</div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[31%] overflow-hidden"><div className="model-hero-marquee-track"><span>{car.name}</span><span>{car.name}</span></div></div>
        <div className="absolute inset-x-[4%] bottom-[13%] h-px bg-[#173d31]/10 dark:bg-white/10" />
        <Image src={heroImage} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="relative z-10 object-contain p-5 pb-16 pt-12 drop-shadow-[0_24px_18px_rgba(16,35,27,.22)] sm:p-8 sm:pb-20 sm:pt-14" />
        <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-center gap-2 sm:justify-end">{images.slice(0, 4).map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} aria-label={`Show ${title} image ${index + 1}`} className={`relative h-11 w-16 overflow-hidden rounded-[5px] border-2 bg-white/85 backdrop-blur transition sm:h-12 sm:w-[70px] ${activeImage === index ? "border-[#a8e91c] shadow-[0_8px_22px_rgba(66,93,47,.16)]" : "border-white/70 hover:border-[#789744]"}`}><Image src={image} alt="" fill sizes="70px" className="object-contain p-1" /></button>)}<Link href={getModelPhotosPath(car.brand.slug, car.slug)} aria-label={`View all ${title} photos`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white/90 text-[#173d31] shadow-sm backdrop-blur sm:h-12 sm:w-12"><Camera size={14} /></Link></div>
      </div>
    </div>

    <style jsx>{`
      @keyframes model-name-marquee {
        from { transform: translateX(-50%); }
        to { transform: translateX(0); }
      }
      .model-hero-marquee-track {
        display: flex;
        width: max-content;
        white-space: nowrap;
        color: rgba(255, 255, 255, .27);
        font-size: 72px;
        font-weight: 600;
        line-height: 1;
        text-transform: uppercase;
        text-shadow: 0 3px 14px rgba(17,45,36,.08);
        -webkit-text-stroke: 1px rgba(23,61,49,.05);
        animation: model-name-marquee 16s linear infinite;
        will-change: transform;
      }
      .model-hero-marquee-track span { padding-right: 5rem; }
      @media (min-width: 1024px) {
        .model-hero-marquee-track { font-size: 94px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .model-hero-marquee-track {
          animation: none;
          transform: translateX(-12%);
        }
      }
    `}</style>
  </section>;
}

function getModelDescription(car: CarDetail): string {
  const selected = car.selectedVariant;
  const bodyStyle = car.bodyType?.name?.toLowerCase() ?? "car";
  if (selected?.isElectric) {
    const battery = selected.electric?.batteryCapacity ? ` a ${selected.electric.batteryCapacity} kWh battery` : " an electric powertrain";
    const range = selected.electric?.claimedRange ? ` and a listed range of ${selected.electric.claimedRange} km` : "";
    return `${car.brand.name} ${car.name} is a ${selected.seatingCapacity}-seat ${bodyStyle} with${battery}${range}. Its ${car.variantCount} configurations span ${formatPriceRange(car)}.`;
  }
  const engine = selected?.ice?.displacementCc ? ` a ${selected.ice.displacementCc} cc engine` : " multiple powertrain choices";
  const mileage = selected?.ice?.claimedFe ? ` and listed mileage of ${selected.ice.claimedFe} km/l` : "";
  return `${car.brand.name} ${car.name} is a ${selected?.seatingCapacity ? `${selected.seatingCapacity}-seat ` : ""}${bodyStyle} with${engine}${mileage}. Its ${car.variantCount} configurations span ${formatPriceRange(car)}.`;
}

function getHeroHighlights(car: CarDetail) {
  const selected = car.selectedVariant;
  const electric = selected?.electric;
  const ice = selected?.ice;
  if (selected?.isElectric) return [
    electric?.powerPs ? { icon: <CircleGauge size={16} />, label: "Max power", value: `${electric.powerPs} PS` } : null,
    electric?.batteryCapacity ? { icon: <BatteryCharging size={16} />, label: "Battery", value: `${electric.batteryCapacity} kWh` } : null,
    electric?.claimedRange ? { icon: <Gauge size={16} />, label: "Claimed range", value: `${electric.claimedRange} km` } : null,
    selected.seatingCapacity ? { icon: <Users size={16} />, label: "Seating", value: `${selected.seatingCapacity} seats` } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
  return [
    ice?.powerPs ? { icon: <CircleGauge size={16} />, label: "Max power", value: `${ice.powerPs} PS` } : null,
    ice?.displacementCc ? { icon: <Gauge size={16} />, label: "Engine", value: `${ice.displacementCc} cc` } : null,
    ice?.claimedFe ? { icon: <Fuel size={16} />, label: "Mileage", value: `${ice.claimedFe} km/l` } : null,
    selected?.seatingCapacity ? { icon: <Users size={16} />, label: "Seating", value: `${selected.seatingCapacity} seats` } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
}
