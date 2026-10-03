import type { BrandCarsFilters } from "@/lib/brands/brand.types";
import { formatPrice } from "@/lib/home/home.format";
import type { HomeCar } from "@/lib/home/home.types";

export default function BrandFaqSection({ brandName, cars, filters, total }: { brandName: string; cars: HomeCar[]; filters: BrandCarsFilters; total: number }) {
  if (cars.length === 0) return null;
  const pricedCars = cars.filter((car) => Number(car.priceMin) > 0).sort((a, b) => Number(a.priceMin) - Number(b.priceMin));
  const cheapest = pricedCars[0];
  const mostExpensive = [...pricedCars].sort((a, b) => Number(b.priceMax ?? b.priceMin) - Number(a.priceMax ?? a.priceMin))[0];
  const bodyTypes = filters.bodyTypes.map((item) => item.name).join(", ");
  const hasElectric = filters.fuelTypes.some((item) => item.value === "electric");
  const min = formatPrice(filters.priceRange.min);
  const max = formatPrice(filters.priceRange.max);
  const items = [
    { question: `How many ${brandName} cars are available in India?`, answer: `${total} ${brandName} models are currently listed as available on ApniCars.` },
    cheapest ? { question: `Which is the most affordable ${brandName} car?`, answer: `${brandName} ${cheapest.name} is the most affordable listed model, starting at ${formatPrice(cheapest.priceMin) ?? "a price to be announced"}.` } : null,
    mostExpensive ? { question: `Which is the most expensive ${brandName} car?`, answer: `${brandName} ${mostExpensive.name} sits at the top of the listed range, reaching ${formatPrice(mostExpensive.priceMax ?? mostExpensive.priceMin) ?? "a price to be announced"}.` } : null,
    { question: `What is the price range of ${brandName} cars?`, answer: min && max ? `${brandName} cars currently range from ${min} to ${max}.` : "Prices vary by model and variant." },
    bodyTypes ? { question: `Which body styles does ${brandName} offer?`, answer: `The current ${brandName} range includes ${bodyTypes}.` } : null,
    { question: `Does ${brandName} offer electric cars?`, answer: hasElectric ? `Yes. Electric options are present in the current ${brandName} range.` : `No electric model is currently listed in the available ${brandName} range.` },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return <section id="faqs" className="bg-white py-10 dark:bg-[#0a1d18] sm:py-12"><div className="page-shell grid gap-7 lg:grid-cols-3"><div><p className="text-[9px] font-semibold text-[#698078]">Quick answers</p><h2 className="mt-1 text-[23px] font-semibold sm:text-[27px]">{brandName} cars FAQs</h2><p className="mt-3 max-w-[330px] text-[10px] leading-5 text-[#697871] dark:text-white/48">Answers generated from the current model, price and filter data shown on this page.</p></div><div className="divide-y divide-black/[0.08] border-y border-black/[0.08] lg:col-span-2 dark:divide-white/10 dark:border-white/10">{items.map((item) => <details key={item.question} className="group"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[11px] font-semibold"><span>{item.question}</span><span className="text-[16px] font-normal text-[#668078] group-open:rotate-45">+</span></summary><p className="max-w-[680px] pb-4 text-[10px] leading-5 text-[#65756e] dark:text-white/52">{item.answer}</p></details>)}</div></div></section>;
}
