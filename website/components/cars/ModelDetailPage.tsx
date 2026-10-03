import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Bell, Camera, CarFront, CircleGauge, Fuel, Gauge, GitCompareArrows, IndianRupee, ShieldCheck, Users, Zap } from "lucide-react";
import ModelHero from "./ModelHero";
import ModelSectionNav, { type ModelSectionItem } from "./ModelSectionNav";
import ModelStickySidebar from "./ModelStickySidebar";
import ModelTrendingCars from "./ModelTrendingCars";
import ModelVariantList from "./ModelVariantList";
import ModelRangeGuide from "./ModelRangeGuide";
import ModelRivalComparison from "./ModelRivalComparison";
import ModelNewsSection from "./ModelNewsSection";
import CarSuggestions from "./CarSuggestions";
import CarSpecPanel from "./CarSpecPanel";
import ExploreBrandsSection from "@/components/brands/ExploreBrandsSection";
import type { CarDetail, CarFaq, CarNewsStory, CarVariantOption } from "@/lib/cars/car.types";
import type { HomeCar } from "@/lib/home/home.types";
import type { BrandSummary } from "@/lib/brands/brand.types";
import { getModelPhotosPath, getVariantPath } from "@/lib/cars/car.urls";
import { formatPrice, formatPriceRange } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";

type Props = { car: CarDetail; variants: CarVariantOption[]; faqs: CarFaq[]; news: CarNewsStory[]; similarCars: HomeCar[]; exploreBrands: BrandSummary[] };

export default function ModelDetailPage({ car, variants, faqs, news, similarCars, exploreBrands }: Props) {
  const selected = car.selectedVariant;
  const title = `${car.brand.name} ${car.name}`;
  const powertrain = selected?.electric ?? selected?.ice ?? null;
  const quickSpecs = [
    selected?.isElectric && selected.electric?.claimedRange ? { icon: <BatteryCharging size={17} />, label: "Range", value: `${selected.electric.claimedRange} km` } : null,
    !selected?.isElectric && selected?.ice?.displacementCc ? { icon: <Gauge size={17} />, label: "Engine", value: `${selected.ice.displacementCc} cc` } : null,
    powertrain?.powerPs ? { icon: <CircleGauge size={17} />, label: "Power", value: `${powertrain.powerPs} PS` } : null,
    selected?.seatingCapacity ? { icon: <Users size={17} />, label: "Seating", value: `${selected.seatingCapacity} seats` } : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));
  const sectionItems: ModelSectionItem[] = [
    { id: "overview", label: "Overview" },
    { id: "variants", label: "Variants" },
    ...(variants.length > 0 ? [{ id: "range-guide", label: "Range guide" }] : []),
    ...(selected ? [{ id: "specs", label: "Specifications" }] : []),
    ...(car.colors.length > 0 || car.images.length > 0 ? [{ id: "colours", label: "Colours" }] : []),
    ...(similarCars.length > 0 ? [{ id: "compare-rivals", label: "Compare" }] : []),
    ...(news.length > 0 ? [{ id: "news", label: "News" }] : []),
    ...(faqs.length > 0 ? [{ id: "faqs", label: "FAQs" }] : []),
    ...(similarCars.length > 0 ? [{ id: "similar-cars", label: "Similar cars" }] : []),
  ];

  return <main className="overflow-x-clip bg-[#f3f6f4] text-[#10231b] dark:bg-[#071813] dark:text-white">
    <ModelHero car={car} />

    <ModelSectionNav items={sectionItems} />

    <div className="page-shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
      <div className="min-w-0 space-y-14">
        <section id="overview"><p className="text-[10px] font-semibold text-[#688078]">Model overview</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">The essentials, without the noise</h2><div className={`mt-6 grid gap-px overflow-hidden rounded-[8px] border border-black/[0.08] bg-black/[0.08] sm:grid-cols-2 dark:border-white/10 dark:bg-white/10 ${quickSpecs.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>{quickSpecs.map((spec) => <div key={spec.label} className="bg-white p-5 dark:bg-[#102720]"><span className="text-[#55766a] dark:text-[#c9ff49]">{spec.icon}</span><p className="mt-5 text-[9px] text-[#7b8983] dark:text-white/38">{spec.label}</p><strong className="mt-1 block text-[13px]">{spec.value}</strong></div>)}</div><p className="mt-6 max-w-[780px] text-[12px] leading-6 text-[#5f7068] dark:text-white/55">{title} is available across {car.variantCount} configurations, with prices ranging from {formatPriceRange(car)}. Use the variant list to move from a broad model overview to exact configuration-level equipment and specifications.</p></section>

        <section id="variants"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold text-[#688078]">Choose your configuration</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">{car.name} variants and prices</h2><p className="mt-2 text-[10px] text-[#718078] dark:text-white/45">Showing six at a time so the range stays easy to scan.</p></div><span className="rounded-full bg-[#e7eee9] px-3 py-2 text-[9px] font-semibold text-[#466158] dark:bg-white/5 dark:text-white/55">{variants.length} total variants</span></div><div className="mt-6"><ModelVariantList variants={variants} brandSlug={car.brand.slug} modelSlug={car.slug} /></div></section>

        <ModelRangeGuide variants={variants} brandSlug={car.brand.slug} modelSlug={car.slug} modelName={car.name} />

        {selected && <section id="specs"><p className="text-[10px] font-semibold text-[#688078]">Range snapshot</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Base configuration specifications</h2><p className="mt-2 text-[10px] text-[#718078] dark:text-white/45">A quick technical baseline. Open any variant for its exact specification sheet.</p><div className="mt-6 grid gap-4 xl:grid-cols-2"><CarSpecPanel icon={selected.isElectric ? <BatteryCharging size={18} /> : <Fuel size={18} />} title={selected.isElectric ? "Electric powertrain" : "Engine and performance"} data={selected.electric ?? selected.ice} /><CarSpecPanel icon={<CarFront size={18} />} title="Dimensions and chassis" data={selected.dimensions} /></div></section>}

        {(car.colors.length > 0 || car.images.length > 0) && <section id="colours">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold text-[#688078]">Exterior palette</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">Choose your {car.name} finish</h2><p className="mt-2 max-w-[560px] text-[10px] leading-5 text-[#708078] dark:text-white/45">Explore the available paint finishes and see the design details from every angle.</p></div><Link href={getModelPhotosPath(car.brand.slug, car.slug)} className="inline-flex min-h-10 items-center gap-2 rounded-[5px] border border-[#264b3e]/20 bg-white px-4 text-[9px] font-semibold text-[#315548] transition-colors hover:border-[#264b3e]/40 dark:border-white/15 dark:bg-[#102720] dark:text-[#dfff97]">View all photos <ArrowRight size={12} /></Link></div>

          <div className="mt-6 grid overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720] lg:grid-cols-[minmax(0,1fr)_280px]">
            <Link href={getModelPhotosPath(car.brand.slug, car.slug)} className="group relative min-h-[340px] overflow-hidden bg-[#e7ece9] sm:min-h-[440px]">
              {car.images[0] ? <Image src={getPublicUploadUrl(car.images[0].imageUrl)!} alt={title} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 bg-[linear-gradient(135deg,#edf2ef,#d8e1dc)]" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071d16]/80 via-[#071d16]/20 to-transparent px-5 pb-5 pt-20 text-white"><p className="text-[9px] font-semibold text-[#dfff97]">{car.brand.name} colour collection</p><strong className="mt-1 block text-[17px] font-semibold">Designed to look distinct in every finish</strong></div>
            </Link>

            <div className="flex flex-col border-t border-black/[0.08] lg:border-l lg:border-t-0 dark:border-white/10"><div className="border-b border-black/[0.07] p-5 dark:border-white/10"><div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-semibold text-[#688078]">Available finishes</p><h3 className="mt-1 text-[16px] font-semibold">{car.colors.length || "Curated"} colour options</h3></div><span className="grid h-9 w-9 place-items-center rounded-full bg-[#eff7d9] text-[#486600] dark:bg-[#c9ff49] dark:text-[#173127]"><CarFront size={16} /></span></div></div>
              {car.colors.length > 0 ? <div className="grid flex-1 content-start divide-y divide-black/[0.07] px-5 dark:divide-white/10">{car.colors.map((color, index) => <div key={color.id} className="flex min-h-14 items-center gap-3 py-3"><span className="flex h-7 w-11 shrink-0 overflow-hidden rounded-[4px] border border-black/10 shadow-sm dark:border-white/15">{color.shades.map((shade) => <span key={shade.sortOrder} className="h-full flex-1" style={{ backgroundColor: shade.colorHex }} />)}</span><span className="min-w-0 flex-1"><strong className="block truncate text-[10px] font-semibold">{color.colorName}</strong><small className="mt-0.5 block text-[8px] text-[#829089] dark:text-white/35">{index === 0 ? "Featured finish" : color.shades.length > 1 ? "Dual-tone finish" : "Exterior paint"}</small></span></div>)}</div> : <div className="flex flex-1 items-center p-5 text-[10px] leading-5 text-[#708078] dark:text-white/45">Open the complete gallery to explore this model&apos;s exterior finishes and design details.</div>}
              <Link href={getModelPhotosPath(car.brand.slug, car.slug)} className="m-4 mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] bg-[#173d31] px-4 text-[9px] font-semibold text-white dark:bg-[#c9ff49] dark:text-[#173127]">Explore colour gallery <ArrowRight size={12} /></Link>
            </div>
          </div>

          {car.images.length > 1 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{car.images.slice(1,4).map((image) => <Link key={image.id} href={getModelPhotosPath(car.brand.slug, car.slug)} className="group relative aspect-[16/10] overflow-hidden rounded-[7px] bg-[#e3e9e5]"><Image src={getPublicUploadUrl(image.imageUrl)!} alt={image.caption ?? title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-3 pt-8 text-[8px] font-semibold text-white">{image.caption || "View exterior detail"}</span></Link>)}</div>}
        </section>}

        <ModelRivalComparison car={car} rivals={similarCars} />

        <ModelNewsSection modelName={car.name} stories={news} />

        {faqs.length > 0 && <section id="faqs"><p className="text-[10px] font-semibold text-[#688078]">Buyer questions</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">What buyers usually ask</h2><div className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/10 dark:border-white/10">{faqs.map((faq) => <details key={faq.id} className="group py-4"><summary className="flex list-none items-center justify-between gap-5 text-[12px] font-semibold"><span>{faq.question}</span><span className="text-xl font-normal text-[#587168] group-open:rotate-45">+</span></summary><p className="mt-3 max-w-[760px] text-[11px] leading-6 text-[#63736c] dark:text-white/52">{faq.answer}</p></details>)}</div></section>}

      </div>

      <aside className="relative lg:self-stretch"><ModelStickySidebar><section className="overflow-hidden rounded-[8px] bg-[#0d3026] text-white shadow-[0_18px_40px_rgba(6,33,25,.16)]"><div className="border-b border-white/10 p-5"><p className="text-[9px] font-semibold text-[#c9ff49]">Buyer command centre</p><h3 className="mt-2 text-[18px] font-semibold">Plan your {car.name}</h3><p className="mt-3 text-[9px] text-white/42">Price range</p><strong className="mt-1 block text-[18px] text-[#dfff97]">{formatPriceRange(car)}</strong></div><div className="grid gap-2 p-4"><SidebarAction href="/emi-calculator" icon={<IndianRupee size={13} />} label="Calculate monthly EMI" primary /><SidebarAction href="/compare" icon={<GitCompareArrows size={13} />} label="Compare with another car" /><SidebarAction href={getModelPhotosPath(car.brand.slug, car.slug)} icon={<Camera size={13} />} label="Explore all photos" /><SidebarAction href="#variants" icon={<Bell size={13} />} label="Track prices and variants" /></div></section>
        {variants.length > 0 && <section className="rounded-[8px] border border-black/[0.08] bg-white p-4 dark:border-white/10 dark:bg-[#102720]"><div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold text-[#668078]">Fast shortlist</p><h3 className="mt-1 text-[15px] font-semibold">Popular variants</h3></div><Zap size={16} className="text-[#6d8e13]" /></div><div className="mt-4 divide-y divide-black/[0.07] dark:divide-white/10">{variants.filter((v) => v.slug).slice(0,4).map((variant) => <Link key={variant.id} href={getVariantPath(car.brand.slug, car.slug, variant.slug!)} className="flex items-center justify-between gap-3 py-3 text-[10px]"><span className="line-clamp-1">{variant.variantName}</span><strong className="shrink-0 text-[9px] text-[#456157]">{formatPrice(variant.price)}</strong></Link>)}</div></section>}
        <ModelTrendingCars cars={similarCars} brandName={car.brand.name} brandSlug={car.brand.slug} />
        <section className="rounded-[8px] border border-black/[0.08] bg-white p-4 dark:border-white/10 dark:bg-[#102720]"><p className="text-[9px] font-semibold text-[#668078]">Research shortcuts</p><div className="mt-3 divide-y divide-black/[0.07] dark:divide-white/10"><SidebarShortcut href="#range-guide" label="Model range guide" /><SidebarShortcut href="#compare-rivals" label="Compare close rivals" />{news.length > 0 && <SidebarShortcut href="#news" label="Latest model news" />}{faqs.length > 0 && <SidebarShortcut href="#faqs" label="Buyer FAQs" />}</div></section>
        <section className="rounded-[8px] border border-[#b8d55a] bg-[#eff8d9] p-4 text-[#173127] dark:bg-[#c9ff49]"><ShieldCheck size={17} /><h3 className="mt-3 text-[14px] font-semibold">Structured, comparable data</h3><p className="mt-2 text-[9px] leading-4 text-[#496050]">Variant prices, specifications and equipment stay separated so you can compare the exact configuration.</p></section>
      </ModelStickySidebar></aside>
    </div>
    {similarCars.length > 0 && <div id="similar-cars"><CarSuggestions cars={similarCars} title={`Cars similar to the ${car.name}`} /></div>}
    <div id="explore-brands"><ExploreBrandsSection brands={exploreBrands} eyebrow="Continue researching" title="Explore popular car brands" description="Move across manufacturers and compare the breadth of their current model ranges." /></div>
  </main>;
}

function SidebarAction({ href, icon, label, primary = false }: { href: string; icon: React.ReactNode; label: string; primary?: boolean }) { return <Link href={href} className={`inline-flex min-h-10 items-center gap-2 rounded-[5px] px-3 text-[9px] font-semibold ${primary ? "bg-[#c9ff49] text-[#10271f]" : "border border-white/15 text-white/72"}`}>{icon}<span>{label}</span><ArrowRight size={11} className="ml-auto" /></Link>; }

function SidebarShortcut({ href, label }: { href: string; label: string }) { return <Link href={href} className="flex items-center justify-between gap-3 py-3 text-[9px] font-semibold text-[#50675d] dark:text-white/55"><span>{label}</span><ArrowRight size={11} /></Link>; }

