import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModelDetailPage from "@/components/cars/ModelDetailPage";
import { getCarDetail, getCarFaqs, getCarNews, getCarVariants, getSimilarCars } from "@/lib/cars/car.api";
import { getBrandNews, getBrandsWithCounts } from "@/lib/brands/brand.api";
import { extractBrandSlug } from "@/lib/cars/car.urls";

export const revalidate = 180;

type PageProps = { params: Promise<{ brandCarsSlug: string; modelSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) return {};
  const car = await getCarDetail(brandSlug, modelSlug);
  if (!car) return {};
  return {
    title: `${car.brand.name} ${car.name} Price, Variants & Specs | ApniCars`,
    description: `Explore ${car.brand.name} ${car.name} prices, variants, specifications, features, colours and photos in India.`,
  };
}

export default async function ModelPage({ params }: PageProps) {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) notFound();
  const [car, variants, faqs, modelNews, similarCars, brands] = await Promise.all([
    getCarDetail(brandSlug, modelSlug),
    getCarVariants(brandSlug, modelSlug),
    getCarFaqs(brandSlug, modelSlug),
    getCarNews(brandSlug, modelSlug),
    getSimilarCars(brandSlug, modelSlug),
    getBrandsWithCounts(),
  ]);
  if (!car) notFound();
  const news = modelNews.length > 0 ? modelNews : await getBrandNews(brandSlug);
  const exploreBrands = brands
    .filter((brand) => brand.slug !== brandSlug)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return <ModelDetailPage car={car} variants={variants} faqs={faqs} news={news} similarCars={similarCars} exploreBrands={exploreBrands} />;
}
