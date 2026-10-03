import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronUp, GitCompareArrows, Minus, Sparkles } from "lucide-react";
import type { CarVariantComparison, CarVariantComparisonFeature, CarVariantComparisonOption, CarVariantDetail } from "@/lib/cars/car.types";
import { getVariantPath } from "@/lib/cars/car.urls";
import { formatPrice } from "@/lib/home/home.format";

type Props = {
  brandSlug: string;
  modelSlug: string;
  current: CarVariantDetail;
  comparison: CarVariantComparison;
};

export default function VariantComparisonSection({ brandSlug, modelSlug, current, comparison }: Props) {
  if (!comparison.lower && !comparison.upper) return null;
  const currentAdvantages = comparison.lower?.featuresAddedByCurrent ?? [];

  return <section id="variant-comparison">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-semibold text-[#668078]">Make the price step clear</p><h2 className="mt-1 text-[26px] font-semibold sm:text-[31px]">What changes around this variant</h2><p className="mt-2 max-w-[680px] text-[10px] leading-5 text-[#718078] dark:text-white/45">Compare the selected configuration with the nearest lower and upper variants by price.</p></div><span className="inline-flex items-center gap-2 rounded-[5px] bg-[#e7eee9] px-3 py-2 text-[9px] font-semibold text-[#466158] dark:bg-white/5 dark:text-white/55"><GitCompareArrows size={13} /> Exact equipment differences</span></div>

    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
      {comparison.lower ? <AlternativeCard option={comparison.lower} direction="lower" brandSlug={brandSlug} modelSlug={modelSlug} /> : <EdgeCard label="This is the entry variant" />}

      <article className="flex w-72 shrink-0 flex-col overflow-hidden rounded-[8px] bg-[#0d3026] text-white shadow-[0_20px_46px_rgba(5,34,25,.18)] lg:w-auto">
        <div className="border-b border-white/10 p-5"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#c9ff49] px-2.5 py-1.5 text-[8px] font-semibold text-[#173127]">Selected variant</span><Sparkles size={15} className="text-[#c9ff49]" /></div><h3 className="mt-5 text-[16px] font-semibold leading-5 normal-case">{current.variantName}</h3><strong className="mt-2 block text-[18px] font-semibold text-[#dfff97]">{formatPrice(current.price)}</strong></div>
        <div className="grid grid-cols-2 gap-px bg-white/10"><SpecCell label="Transmission" value={current.transmission ?? "Not listed"} dark /><SpecCell label="Seating" value={`${current.seatingCapacity} seats`} dark /></div>
        <div className="flex-1 p-5"><p className="text-[9px] font-semibold text-white/48">{comparison.lower ? `Adds over ${comparison.lower.variantName}` : "Current equipment"}</p>{currentAdvantages.length > 0 ? <FeatureList features={currentAdvantages} dark /> : <p className="mt-4 text-[9px] leading-5 text-white/42">This is the first configuration in the price-ordered range.</p>}</div>
        <div className="border-t border-white/10 px-5 py-4 text-[9px] leading-4 text-white/45">You are viewing the complete specifications for this exact configuration.</div>
      </article>

      {comparison.upper ? <AlternativeCard option={comparison.upper} direction="upper" brandSlug={brandSlug} modelSlug={modelSlug} /> : <EdgeCard label="This is the range-topping variant" />}
    </div>
  </section>;
}

function AlternativeCard({ option, direction, brandSlug, modelSlug }: { option: CarVariantComparisonOption; direction: "lower" | "upper"; brandSlug: string; modelSlug: string }) {
  const isLower = direction === "lower";
  const difference = formatPrice(String(Math.abs(Number(option.priceDifference)))) ?? "No price difference";
  const features = isLower ? option.featuresAddedByCurrent : option.featuresAddedByAlternative;
  const differenceCount = isLower ? option.currentFeatureDifferenceCount : option.alternativeFeatureDifferenceCount;
  const powertrain = getPowertrainLabel(option);

  return <article className="flex w-72 shrink-0 flex-col overflow-hidden rounded-[8px] border border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#102720] lg:w-auto">
    <div className="border-b border-black/[0.07] p-5 dark:border-white/10"><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-[9px] font-semibold text-[#668078] dark:text-white/48">{isLower ? <ChevronDown size={13} /> : <ChevronUp size={13} />}{isLower ? "Lower variant" : "Upper variant"}</span><span className={`rounded-[4px] px-2 py-1 text-[8px] font-semibold ${isLower ? "bg-[#eef2ef] text-[#557067] dark:bg-white/5 dark:text-white/55" : "bg-[#eaf3d5] text-[#58720f] dark:bg-[#c9ff49]/10 dark:text-[#dfff97]"}`}>{isLower ? `Save ${difference}` : `Add ${difference}`}</span></div><h3 className="mt-5 text-[15px] font-semibold leading-5 normal-case">{option.variantName}</h3><strong className="mt-2 block text-[16px] font-semibold text-[#315548] dark:text-[#dfff97]">{formatPrice(option.price)}</strong></div>
    <div className="grid grid-cols-2 gap-px bg-black/[0.07] dark:bg-white/10"><SpecCell label="Powertrain" value={powertrain} /><SpecCell label="Transmission" value={option.transmission ?? "Not listed"} /></div>
    <div className="flex-1 p-5"><p className="text-[9px] font-semibold text-[#668078] dark:text-white/48">{isLower ? "Selected variant adds" : "Upgrade adds"}</p>{features.length > 0 ? <FeatureList features={features} /> : <p className="mt-4 text-[9px] leading-5 text-[#7b8982] dark:text-white/40">No equipment difference is recorded in the current feature data.</p>}{differenceCount > features.length && <p className="mt-3 text-[8px] font-semibold text-[#668078] dark:text-white/38">+{differenceCount - features.length} more recorded differences</p>}</div>
    <Link href={getVariantPath(brandSlug, modelSlug, option.slug)} className="m-4 mt-0 inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] border border-[#264b3e]/20 text-[9px] font-semibold text-[#315548] dark:border-white/15 dark:text-white">View this variant <ArrowRight size={11} /></Link>
  </article>;
}

function FeatureList({ features, dark = false }: { features: CarVariantComparisonFeature[]; dark?: boolean }) {
  return <ul className="mt-4 grid gap-3">{features.slice(0, 4).map((feature) => <li key={feature.id} className={`flex items-start gap-2 text-[9px] leading-4 ${dark ? "text-white/65" : "text-[#607068] dark:text-white/55"}`}><Check size={11} className={`mt-0.5 shrink-0 ${dark ? "text-[#c9ff49]" : "text-[#779a18]"}`} /><span>{feature.name}{feature.value ? `: ${feature.value}` : ""}</span></li>)}</ul>;
}

function SpecCell({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return <div className={dark ? "bg-[#12382d] p-4" : "bg-[#f4f7f5] p-4 dark:bg-[#143027]"}><small className={`block text-[8px] ${dark ? "text-white/38" : "text-[#849189] dark:text-white/35"}`}>{label}</small><strong className="mt-1 block truncate text-[9px] font-semibold">{value}</strong></div>;
}

function EdgeCard({ label }: { label: string }) {
  return <article className="flex min-h-[360px] w-72 shrink-0 items-center justify-center rounded-[8px] border border-dashed border-black/15 bg-white/35 p-6 text-center dark:border-white/15 dark:bg-white/[0.02] lg:w-auto"><div><Minus size={18} className="mx-auto text-[#7d8b84]" /><p className="mt-3 text-[10px] font-semibold text-[#687970] dark:text-white/45">{label}</p></div></article>;
}

function getPowertrainLabel(option: CarVariantComparisonOption): string {
  if (option.powertrain.type === "electric") {
    return option.powertrain.batteryCapacity ? `${option.powertrain.batteryCapacity} kWh` : "Electric";
  }
  return option.powertrain.displacementCc ? `${option.powertrain.displacementCc} cc` : option.powertrain.fuelType ?? "ICE";
}
