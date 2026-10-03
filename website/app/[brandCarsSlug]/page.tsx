import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calculator, CarFront, Fuel, GitCompareArrows, Shapes } from "lucide-react";
import BrandCarCard from "@/components/brands/BrandCarCard";
import BrandCompareStrip from "@/components/brands/BrandCompareStrip";
import BrandDiscoverySection from "@/components/brands/BrandDiscoverySection";
import BrandFaqSection from "@/components/brands/BrandFaqSection";
import BrandFilters from "@/components/brands/BrandFilters";
import BrandModelHighlights from "@/components/brands/BrandModelHighlights";
import BrandNewsSection from "@/components/brands/BrandNewsSection";
import BrandPageNav from "@/components/brands/BrandPageNav";
import BrandPriceList from "@/components/brands/BrandPriceList";
import BrandSort from "@/components/brands/BrandSort";
import BrandUpcomingSection from "@/components/brands/BrandUpcomingSection";
import ExploreBrandsSection from "@/components/brands/ExploreBrandsSection";
import { getBrandCars, getBrandNews, getBrandUpcomingCars, getBrandsWithCounts } from "@/lib/brands/brand.api";
import type { BrandCarsQuery } from "@/lib/brands/brand.types";
import { formatPrice } from "@/lib/home/home.format";
import { getPublicUploadUrl } from "@/lib/home/home.api";
import { extractBrandSlug } from "@/lib/cars/car.urls";

export const revalidate = 180;

type PageProps = { params: Promise<{ brandCarsSlug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
const sortValues = new Set(["popularity", "price-asc", "price-desc", "rating"]);

function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function splitValues(value: string | undefined) { return value?.split(",").filter(Boolean) ?? []; }
function buildQuery(search: Record<string, string | string[] | undefined>): BrandCarsQuery {
  const page = Number(first(search.page));
  const sort = first(search.sort) ?? "popularity";
  return { page: Number.isInteger(page) && page > 0 ? page : 1, limit: 12, bodyType: first(search.bodyType), fuelType: first(search.fuelType), minPrice: first(search.minPrice), maxPrice: first(search.maxPrice), sort: sortValues.has(sort) ? sort as BrandCarsQuery["sort"] : "popularity" };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = extractBrandSlug((await params).brandCarsSlug);
  if (!slug) return {};
  const result = await getBrandCars(slug, { page: 1, limit: 1 });
  return result ? { title: `${result.brand.name} Cars in India | Prices and Models | ApniCars`, description: `Explore ${result.brand.name} cars in India. Compare prices, body styles, fuel types and find the right ${result.brand.name} model for you.` } : {};
}

export default async function BrandCarsPage({ params, searchParams }: PageProps) {
  const [{ brandCarsSlug }, search] = await Promise.all([params, searchParams]);
  const slug = extractBrandSlug(brandCarsSlug);
  if (!slug) notFound();
  const query = buildQuery(search);
  const [result, popularResult, priceListResult, upcomingCars, news, allBrands] = await Promise.all([
    getBrandCars(slug, query),
    getBrandCars(slug, { page: 1, limit: 6, sort: "popularity" }),
    getBrandCars(slug, { page: 1, limit: 48, sort: "price-asc" }),
    getBrandUpcomingCars(slug),
    getBrandNews(slug),
    getBrandsWithCounts(),
  ]);
  if (!result || !popularResult || !priceListResult) notFound();

  const popularCars = popularResult.cars;
  const priceListCars = priceListResult.cars;
  const logo = getPublicUploadUrl(result.brand.logoUrl);
  const heroImage = getPublicUploadUrl(popularCars[0]?.coverImageUrl ?? null);
  const priceMin = formatPrice(result.filters.priceRange.min);
  const priceMax = formatPrice(result.filters.priceRange.max);
  const priceLabel = priceMin && priceMax ? `${priceMin} - ${priceMax.replace("Rs. ", "")}` : priceMin ?? priceMax ?? "On request";
  const otherBrands = allBrands.filter((brand) => brand.slug !== slug).sort((a, b) => b.count - a.count);

  return <main className="bg-[#f4f6f4] text-[#102019] dark:bg-[#081b16] dark:text-white">
    <section style={{ minHeight: 300, backgroundColor: "#071d17" }} className="relative flex overflow-hidden text-white">{heroImage && <Image src={heroImage} alt={`${result.brand.name} car`} fill priority sizes="100vw" className="object-contain object-right" />}<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,20,15,1)_0%,rgba(3,20,15,.96)_42%,rgba(3,20,15,.44)_72%,rgba(3,20,15,.18)_100%)]" /><div className="page-shell relative flex flex-col py-7"><nav className="flex items-center gap-2 text-[9px] text-white/50"><Link href="/">Home</Link><span>/</span><Link href="/brands">Brands</Link><span>/</span><span className="text-white/80">{result.brand.name}</span></nav><div className="my-auto flex items-center gap-5 py-6"><div style={{ width: 92, height: 58 }} className="relative hidden shrink-0 rounded-[7px] bg-white shadow-lg sm:block">{logo ? <Image src={logo} alt={`${result.brand.name} logo`} fill sizes="92px" className="object-contain p-2" /> : <CarFront size={28} className="m-auto h-full text-[#54685f]" />}</div><div className="max-w-[560px]"><p className="text-[9px] font-semibold text-[#c9ff49]">Complete model range</p><h1 className="mt-2 text-[31px] font-semibold leading-tight sm:text-[40px]">{result.brand.name} cars in India</h1><p className="mt-3 max-w-[500px] text-[10px] leading-5 text-white/62 sm:text-[11px]">Prices, body styles and the complete current lineup, arranged to make your shortlist faster.</p></div></div></div></section>

    <section className="border-b border-black/[0.08] bg-white dark:border-white/10 dark:bg-[#0f2a22]"><div className="page-shell grid grid-cols-2 sm:grid-cols-4"><Metric icon={<CarFront size={13} />} value={String(result.pagination.total)} label="models" /><Metric icon={<Calculator size={13} />} value={priceLabel} label="price range" /><Metric icon={<Shapes size={13} />} value={String(result.filters.bodyTypes.length)} label="body styles" /><Metric icon={<Fuel size={13} />} value={String(result.filters.fuelTypes.length)} label="fuel options" /></div></section>

    <BrandPageNav hasUpcoming={upcomingCars.length > 0} hasNews={news.length > 0} />

    {popularCars.length > 0 && <section className="page-shell py-9 sm:py-11"><div className="flex items-end justify-between gap-5"><div><p className="text-[9px] font-semibold text-[#698078]">Most considered</p><h2 className="mt-1 text-[23px] font-semibold sm:text-[27px]">Popular {result.brand.name} cars</h2></div><Link href="#all-models" className="hidden items-center gap-2 text-[9px] font-semibold text-[#315447] sm:flex">Complete lineup <ArrowRight size={12} /></Link></div><div className="mt-5 flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">{popularCars.slice(0, 4).map((car, index) => <div key={car.id} className="w-72 shrink-0 lg:w-auto"><BrandCarCard car={car} priority={index < 2} /></div>)}</div></section>}

    <section id="all-models" className="border-t border-black/[0.07] bg-white py-10 dark:border-white/10 dark:bg-[#0a1d18] sm:py-12"><div className="page-shell"><details className="mb-5 rounded-[7px] border border-black/10 bg-[#f7f9f7] lg:hidden dark:border-white/10 dark:bg-[#102720]"><summary className="px-4 py-3.5 text-[10px] font-semibold">Filters and budget</summary><div className="border-t border-black/[0.07] p-2 dark:border-white/10"><BrandFilters filters={result.filters} activeBodyTypes={splitValues(query.bodyType)} activeFuelTypes={splitValues(query.fuelType)} minPrice={query.minPrice} maxPrice={query.maxPrice} /></div></details><div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]"><aside className="hidden lg:block"><div className="sticky top-[104px]"><BrandFilters filters={result.filters} activeBodyTypes={splitValues(query.bodyType)} activeFuelTypes={splitValues(query.fuelType)} minPrice={query.minPrice} maxPrice={query.maxPrice} /><div className="mt-3 grid gap-2 bg-[#102f27] p-3.5 text-white"><p className="text-[9px] font-semibold text-[#c9ff49]">Buyer tools</p><ToolLink href="/compare" icon={<GitCompareArrows size={13} />} label="Compare cars" /><ToolLink href="/emi-calculator" icon={<Calculator size={13} />} label="Calculate EMI" /></div></div></aside><div className="min-w-0"><div className="flex items-center justify-between gap-3 border-b border-black/[0.08] pb-4 dark:border-white/10"><div><h2 className="text-[22px] font-semibold">All {result.brand.name} models</h2><p className="mt-1 text-[9px] text-[#73817b]">{result.pagination.total} cars found</p></div><BrandSort value={query.sort ?? "popularity"} /></div>{result.cars.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{result.cars.map((car) => <BrandCarCard key={car.id} car={car} />)}</div> : <div className="mt-5 border border-dashed border-black/15 py-14 text-center dark:border-white/15"><CarFront size={28} className="mx-auto text-[#829089]" /><h3 className="mt-3 text-[12px] font-semibold">No cars match these filters</h3><Link href={`/${slug}-cars`} className="mt-2 inline-flex text-[9px] font-semibold text-[#587400]">Clear filters</Link></div>}<Pagination current={result.pagination.page} total={result.pagination.totalPages} search={search} /></div></div></div></section>

    <BrandPriceList brandName={result.brand.name} cars={priceListCars} />
    <BrandDiscoverySection brandName={result.brand.name} slug={slug} filters={priceListResult.filters} />
    <BrandModelHighlights brandName={result.brand.name} cars={popularCars} />
    <BrandCompareStrip brandName={result.brand.name} cars={popularCars} />
    <BrandUpcomingSection brandName={result.brand.name} cars={upcomingCars} />
    <BrandNewsSection brandName={result.brand.name} stories={news} />
    <BrandFaqSection brandName={result.brand.name} cars={priceListCars} filters={priceListResult.filters} total={priceListResult.pagination.total} />
    <ExploreBrandsSection brands={otherBrands} eyebrow="Continue researching" title="Other popular brands" />
  </main>;
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <div className="min-w-0 border-r border-black/[0.08] px-3 py-4 last:border-r-0 dark:border-white/10 sm:px-5"><span className="flex items-center gap-1.5 text-[9px] text-[#60766c] dark:text-[#c9ff49]">{icon}{label}</span><strong className="mt-1.5 block max-w-full text-[11px] font-semibold leading-4 sm:text-[13px]">{value}</strong></div>; }
function ToolLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) { return <Link href={href} className="flex items-center justify-between border border-white/10 px-3 py-2 text-[9px] text-white/75 hover:border-[#c9ff49]/40"><span className="flex items-center gap-2">{icon}{label}</span><ArrowRight size={11} /></Link>; }
function Pagination({ current, total, search }: { current: number; total: number; search: Record<string, string | string[] | undefined> }) { if (total <= 1) return null; const href = (page: number) => { const params = new URLSearchParams(); Object.entries(search).forEach(([key, value]) => { const item = first(value); if (item && key !== "page") params.set(key, item); }); params.set("page", String(page)); return `?${params.toString()}`; }; return <nav className="mt-7 flex items-center justify-between border-t border-black/[0.08] pt-4 dark:border-white/10"><Link href={href(Math.max(1, current - 1))} aria-disabled={current === 1} className={`flex items-center gap-2 text-[9px] font-semibold ${current === 1 ? "pointer-events-none opacity-30" : ""}`}><ArrowLeft size={12} /> Previous</Link><span className="text-[9px] text-[#75827c]">{current} / {total}</span><Link href={href(Math.min(total, current + 1))} aria-disabled={current === total} className={`flex items-center gap-2 text-[9px] font-semibold ${current === total ? "pointer-events-none opacity-30" : ""}`}>Next <ArrowRight size={12} /></Link></nav>; }
