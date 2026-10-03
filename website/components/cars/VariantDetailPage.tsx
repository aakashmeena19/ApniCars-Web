import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Camera, CarFront, Check, ChevronRight, CircleGauge, Fuel, Gauge, Ruler, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import VariantActionPanel from "./VariantActionPanel";
import CarSpecPanel, { getSpecEntries, getSpecValue } from "./CarSpecPanel";
import CarSuggestions from "./CarSuggestions";
import ModelSectionNav, { type ModelSectionItem } from "./ModelSectionNav";
import ModelStickySidebar from "./ModelStickySidebar";
import ModelTrendingCars from "./ModelTrendingCars";
import VariantComparisonSection from "./VariantComparisonSection";
import type { CarDetail, CarVariantOption } from "@/lib/cars/car.types";
import type { HomeCar } from "@/lib/home/home.types";
import { getBrandCarsPath, getModelPath, getModelPhotosPath, getVariantPath } from "@/lib/cars/car.urls";
import { formatPrice } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";

type Props = { car: CarDetail; variants: CarVariantOption[]; similarCars: HomeCar[] };

export default function VariantDetailPage({ car, variants, similarCars }: Props) {
  const variant = car.selectedVariant!;
  const fullName = `${car.brand.name} ${car.name} ${variant.variantName}`;
  const heroImage = getPublicUploadUrl(car.coverImageUrl ?? car.images[0]?.imageUrl) ?? "/images/hero-light-premium.png";
  const modelPath = getModelPath(car.brand.slug, car.slug);
  const powertrain = variant.electric ?? variant.ice;
  const currentIndex = variants.findIndex((item) => item.id === variant.id);
  const warranty = getSpecEntries(variant.dimensions).find(([key]) => key === "vehicleWarrantyRaw")?.[1];
  const highlights = [
    variant.isElectric && variant.electric?.batteryCapacity ? { icon: <BatteryCharging size={18} />, label: "Battery", value: `${variant.electric.batteryCapacity} kWh` } : null,
    !variant.isElectric && variant.ice?.displacementCc ? { icon: <Gauge size={18} />, label: "Engine", value: `${variant.ice.displacementCc} cc` } : null,
    powertrain?.powerPs ? { icon: <CircleGauge size={18} />, label: "Power", value: `${powertrain.powerPs} PS` } : null,
    powertrain?.torqueNm ? { icon: <Zap size={18} />, label: "Torque", value: `${powertrain.torqueNm} Nm` } : null,
    variant.transmission ? { icon: <CarFront size={18} />, label: "Transmission", value: variant.transmission } : null,
    { icon: <Users size={18} />, label: "Seating", value: `${variant.seatingCapacity} seats` },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
  const navItems: ModelSectionItem[] = [
    { id: "configuration", label: "Overview" },
    ...(car.variantComparison?.lower || car.variantComparison?.upper ? [{ id: "variant-comparison", label: "Compare variants" }] : []),
    { id: "performance", label: "Performance" },
    ...(variant.features.length > 0 ? [{ id: "features", label: "Features" }] : []),
    { id: "dimensions", label: "Dimensions" },
    { id: "other-variants", label: "Other variants" },
    ...(similarCars.length > 0 ? [{ id: "similar", label: "Similar cars" }] : []),
  ];
  const nearbyVariants = variants
    .filter((item) => item.id !== variant.id && item.slug)
    .slice(Math.max(0, currentIndex - 2), Math.max(0, currentIndex - 2) + 5);

  return <main className="overflow-x-clip bg-[#f3f6f4] text-[#10231b] dark:bg-[#071813] dark:text-white">
    <div className="border-b border-black/[0.07] bg-white dark:border-white/10 dark:bg-[#091f18]"><div className="page-shell py-4"><nav className="flex items-center gap-1.5 overflow-hidden text-[9px] text-[#708078] dark:text-white/42"><Link href="/brands">Brands</Link><ChevronRight size={10} className="shrink-0" /><Link href={getBrandCarsPath(car.brand.slug)}>{car.brand.name}</Link><ChevronRight size={10} className="shrink-0" /><Link href={modelPath}>{car.name}</Link><ChevronRight size={10} className="shrink-0" /><span className="truncate">{variant.variantName}</span></nav></div></div>

    <section className="bg-white py-4 dark:bg-[#091f18] sm:py-5">
      <div className="page-shell">
        <div className="grid overflow-hidden rounded-[8px] border border-black/[0.08] bg-white shadow-[0_22px_65px_rgba(15,43,34,.09)] dark:border-white/10 dark:bg-[#091f18] lg:grid-cols-2">
          <div className="relative min-h-[300px] overflow-hidden bg-[#e5ebe7] dark:bg-[#123128] sm:min-h-[340px] lg:min-h-[400px]">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[33%] overflow-hidden">
              <div style={{ color: "rgba(255,255,255,.24)", textShadow: "0 3px 14px rgba(17,45,36,.08)", WebkitTextStroke: "1px rgba(23,61,49,.05)" }} className="variant-hero-marquee-track">
                <span>{variant.variantName}</span><span>{variant.variantName}</span>
              </div>
            </div>
            <div className="absolute inset-x-[8%] bottom-[12%] h-px bg-[#153a2e]/12 dark:bg-white/10" />
            <div className="absolute left-[9%] top-[10%] flex flex-wrap gap-2"><span className="rounded-full bg-white/85 px-3 py-2 text-[9px] font-semibold text-[#244b3d] shadow-sm backdrop-blur dark:bg-[#071b15]/75 dark:text-[#dfff97]">Exact variant</span><span className="rounded-full border border-black/10 bg-white/55 px-3 py-2 text-[9px] font-semibold text-[#52675e] backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/65">{currentIndex + 1} of {variants.length}</span></div>
            <Image src={heroImage} alt={fullName} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="relative z-10 object-contain p-5 pt-14 sm:p-8 sm:pt-16" />
            <Link href={getModelPhotosPath(car.brand.slug, car.slug)} className="absolute bottom-5 right-5 z-20 inline-flex min-h-10 items-center gap-2 rounded-[5px] bg-[#0c2d24] px-4 text-[9px] font-semibold text-white shadow-lg dark:bg-[#c9ff49] dark:text-[#173127]"><Camera size={13} /> View model photos</Link>
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-black/[0.08] bg-[#f5f8f6] dark:border-white/10 dark:bg-white/5">{car.brand.logoUrl ? <Image src={getPublicUploadUrl(car.brand.logoUrl)!} alt="" width={25} height={25} className="h-6 w-6 object-contain" /> : <CarFront size={16} />}</span><div><p className="text-[10px] font-semibold text-[#315548] dark:text-[#dfff97]">{car.brand.name} {car.name}</p><p className="mt-0.5 text-[8px] text-[#829089] dark:text-white/35">Variant configuration</p></div></div>
            <h1 className="mt-4 text-[25px] font-semibold leading-[1.08] normal-case sm:text-[28px]">{variant.variantName}</h1>
            <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-[4px] bg-[#eaf3dd] px-2.5 py-1.5 text-[8px] font-semibold text-[#526d0b] dark:bg-[#c9ff49]/10 dark:text-[#dfff97]">{variant.isElectric ? "Electric" : String(variant.ice?.fuelType ?? "Fuel variant")}</span>{variant.transmission && <span className="rounded-[4px] bg-[#edf1ef] px-2.5 py-1.5 text-[8px] font-semibold text-[#52675e] dark:bg-white/5 dark:text-white/60">{variant.transmission}</span>}<span className="rounded-[4px] bg-[#edf1ef] px-2.5 py-1.5 text-[8px] font-semibold text-[#52675e] dark:bg-white/5 dark:text-white/60">{variant.seatingCapacity} seats</span></div>
            <div className="mt-4 border-y border-black/[0.08] py-3 dark:border-white/10"><p className="text-[9px] text-[#75837d] dark:text-white/40">Ex-showroom price</p><div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1"><strong className="text-[23px] font-semibold text-[#173d31] dark:text-[#dfff97]">{formatPrice(variant.price)}</strong><span className="text-[8px] text-[#8a9690] dark:text-white/30">Registration, insurance and city charges additional</span></div></div>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{highlights.slice(0,4).map((item) => <div key={item.label} className="min-w-0"><span className="text-[#5e7b70] dark:text-[#c9ff49]">{item.icon}</span><small className="mt-1 block text-[8px] text-[#819087] dark:text-white/35">{item.label}</small><strong className="mt-0.5 block truncate text-[9px] font-semibold">{item.value}</strong></div>)}</div>
            <div className="mt-auto flex flex-wrap gap-2 pt-4"><Link href="/emi-calculator" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#b7ef2e] px-4 text-[9px] font-semibold text-[#173127]">Calculate EMI <ArrowRight size={12} /></Link><Link href="/compare" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[5px] border border-[#1d493a]/25 px-4 text-[9px] font-semibold text-[#244b3d] dark:border-white/20 dark:text-white">Compare variant</Link></div>
          </div>
        </div>
      </div>
    </section>

    <ModelSectionNav items={navItems} />

    <div className="page-shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="min-w-0 space-y-14">
        <section id="configuration"><p className="text-[10px] font-semibold text-[#668078]">Exact configuration</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">What you get in the {variant.variantName}</h2><p className="mt-2 max-w-[680px] text-[10px] leading-5 text-[#718078] dark:text-white/45">A focused view of this variant&apos;s powertrain, transmission, capacity and core hardware.</p><div className="mt-6 grid overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 xl:grid-cols-3 dark:border-white/10 dark:bg-white/10">{highlights.map((item) => <div key={item.label} className="bg-white p-5 dark:bg-[#102720]"><span className="text-[#537267] dark:text-[#c9ff49]">{item.icon}</span><p className="mt-5 text-[9px] text-[#798780] dark:text-white/38">{item.label}</p><strong className="mt-1 block text-[12px] font-semibold">{item.value}</strong></div>)}</div><div className="mt-4 flex items-start gap-3 border-l-2 border-[#9fca2a] bg-[#eaf0ec] p-4 text-[10px] leading-5 text-[#52675e] dark:bg-[#102720] dark:text-white/55"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#638210]" />All prices and specifications on this page belong to the exact {variant.variantName} configuration.</div></section>

        {car.variantComparison && <VariantComparisonSection brandSlug={car.brand.slug} modelSlug={car.slug} current={variant} comparison={car.variantComparison} />}

        <section id="performance" className="overflow-hidden rounded-[8px] bg-[#0b2a21] text-white"><div className="border-b border-white/10 p-6 sm:p-7"><p className="text-[10px] font-semibold text-[#c9ff49]">Powertrain deep dive</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">{variant.isElectric ? "Battery, range and charging" : "Engine, efficiency and performance"}</h2></div><div className="p-4 sm:p-6"><CarSpecPanel dark icon={variant.isElectric ? <BatteryCharging size={18} /> : <Fuel size={18} />} title={variant.isElectric ? "Electric powertrain" : "Combustion powertrain"} data={variant.electric ?? variant.ice} /></div></section>

        {variant.features.length > 0 && <section id="features"><p className="text-[10px] font-semibold text-[#668078]">Equipment inventory</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Features included as standard</h2><p className="mt-2 max-w-[650px] text-[10px] leading-5 text-[#718078] dark:text-white/45">Equipment is grouped by category so this configuration can be checked without mixing model-level claims.</p><div className="mt-6 divide-y divide-black/[0.08] overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#102720]">{variant.features.map((group) => <article key={group.categoryId ?? group.categoryName} className="grid gap-5 p-5 md:grid-cols-[190px_1fr]"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-[5px] bg-[#eaf2da] text-[#66830e] dark:bg-[#c9ff49]/10 dark:text-[#c9ff49]"><Sparkles size={14} /></span><div><h3 className="text-[12px] font-semibold">{group.categoryName}</h3><p className="mt-1 text-[8px] text-[#819087]">{group.items.length} included features</p></div></div><ul className="grid gap-x-5 gap-y-3 sm:grid-cols-2">{group.items.map((item) => <li key={item.id} className="flex items-start gap-2 text-[9px] leading-4 text-[#607068] dark:text-white/55"><Check size={11} className="mt-0.5 shrink-0 text-[#779a18]" /><span>{item.name}{item.value ? `: ${item.value}` : ""}</span></li>)}</ul></article>)}</div></section>}

        <section id="dimensions"><p className="text-[10px] font-semibold text-[#668078]">Road footprint</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Dimensions, chassis and warranty</h2><p className="mt-2 text-[10px] text-[#718078] dark:text-white/45">The physical measurements and mechanical hardware recorded for this exact variant.</p><div className="mt-6"><CarSpecPanel icon={<Ruler size={18} />} title="Dimensions and chassis" data={variant.dimensions} /></div></section>

        <section id="other-variants"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold text-[#668078]">Compare within the range</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Nearby {car.name} variants</h2></div><Link href={modelPath} className="inline-flex items-center gap-2 text-[9px] font-semibold text-[#315548] dark:text-[#dfff97]">View complete range <ArrowRight size={11} /></Link></div><div className="mt-6 divide-y divide-black/[0.07] overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:divide-white/10 dark:border-white/10 dark:bg-[#102720]">{nearbyVariants.map((item) => <Link key={item.id} href={getVariantPath(car.brand.slug, car.slug, item.slug!)} className="grid gap-3 p-4 transition-colors hover:bg-[#f2f6f3] dark:hover:bg-white/[0.03] sm:grid-cols-[1fr_145px_90px] sm:items-center"><div><h3 className="text-[11px] font-semibold normal-case">{item.variantName}</h3><p className="mt-1 text-[8px] text-[#849189]">Exact specification and equipment</p></div><strong className="text-[10px] text-[#315548] dark:text-[#dfff97]">{formatPrice(item.price)}</strong><span className="flex items-center justify-end gap-2 text-[9px] font-semibold">View <ArrowRight size={11} /></span></Link>)}</div></section>
      </div>

      <aside className="relative lg:self-stretch"><ModelStickySidebar>
        <VariantActionPanel name={fullName} price={formatPrice(variant.price) ?? "Price unavailable"} />
        {nearbyVariants.length > 0 && <section className="overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720]"><div className="border-b border-black/[0.07] p-4 dark:border-white/10"><p className="text-[9px] font-semibold text-[#668078]">Quick variant switch</p><h3 className="mt-1 text-[14px] font-semibold">Nearby configurations</h3></div><div className="divide-y divide-black/[0.07] px-4 dark:divide-white/10">{nearbyVariants.slice(0,4).map((item) => <Link key={item.id} href={getVariantPath(car.brand.slug, car.slug, item.slug!)} className="flex items-center justify-between gap-3 py-3"><span className="min-w-0 truncate text-[9px] font-semibold">{item.variantName}</span><strong className="shrink-0 text-[8px] text-[#55710a] dark:text-[#dfff97]">{formatPrice(item.price)}</strong></Link>)}</div><Link href={modelPath} className="flex items-center gap-2 border-t border-black/[0.07] px-4 py-3 text-[9px] font-semibold text-[#315548] dark:border-white/10 dark:text-[#dfff97]">All {car.name} variants <ArrowRight size={11} /></Link></section>}
        <section className="rounded-[8px] border border-black/[0.08] bg-white p-4 dark:border-white/10 dark:bg-[#102720]"><p className="text-[9px] font-semibold text-[#668078]">Specification navigator</p><div className="mt-3 divide-y divide-black/[0.07] dark:divide-white/10">{[["#performance",variant.isElectric ? "Battery and charging" : "Engine and mileage"],...(variant.features.length > 0 ? [["#features","Features and safety"]] : []),["#dimensions","Dimensions and warranty"],["#other-variants","Nearby variants"]].map(([href,label]) => <Link key={href} href={href} className="flex items-center justify-between py-3 text-[10px] text-[#50675d] dark:text-white/55"><span>{label}</span><ArrowRight size={11} /></Link>)}</div></section>
        <ModelTrendingCars cars={similarCars} brandName={car.brand.name} brandSlug={car.brand.slug} />
        {warranty && <section className="rounded-[8px] border border-[#b9d65b] bg-[#eff8d9] p-4 text-[#173127] dark:bg-[#c9ff49]"><ShieldCheck size={17} /><h3 className="mt-3 text-[14px] font-semibold">Warranty recorded</h3><p className="mt-2 text-[9px] leading-4">{getSpecValue("vehicleWarrantyRaw", warranty as string)}</p></section>}
      </ModelStickySidebar></aside>
    </div>

    {similarCars.length > 0 && <div id="similar"><CarSuggestions cars={similarCars} title={`Cars similar to the ${car.name}`} /></div>}
    <style>{`
      @keyframes variant-name-marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .variant-hero-marquee-track {
        display: flex;
        width: max-content;
        white-space: nowrap;
        font-size: 58px;
        font-weight: 600;
        line-height: 1;
        text-transform: uppercase;
        animation: variant-name-marquee 18s linear infinite;
        will-change: transform;
      }
      .variant-hero-marquee-track span { padding-right: 5rem; }
      @media (min-width: 1024px) {
        .variant-hero-marquee-track { font-size: 76px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .variant-hero-marquee-track {
          animation: none;
          transform: translateX(-8%);
        }
      }
    `}</style>
  </main>;
}
