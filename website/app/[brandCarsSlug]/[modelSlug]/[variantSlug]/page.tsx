import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VariantDetailPage from "@/components/cars/VariantDetailPage";
import { getCarVariantDetail, getCarVariants, getSimilarCars } from "@/lib/cars/car.api";
import { extractBrandSlug } from "@/lib/cars/car.urls";

export const revalidate = 180;

type PageProps = { params: Promise<{ brandCarsSlug: string; modelSlug: string; variantSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandCarsSlug, modelSlug, variantSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug || variantSlug === "photos") return {};
  const car = await getCarVariantDetail(brandSlug, modelSlug, variantSlug);
  if (!car?.selectedVariant) return {};
  const name = `${car.brand.name} ${car.name} ${car.selectedVariant.variantName}`;
  return { title: `${name} Price & Specs | ApniCars`, description: `See ${name} price, features, dimensions, performance and complete specifications.` };
}

export default async function VariantPage({ params }: PageProps) {
  const { brandCarsSlug, modelSlug, variantSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug || variantSlug === "photos") notFound();
  const [car, variants, similarCars] = await Promise.all([
    getCarVariantDetail(brandSlug, modelSlug, variantSlug),
    getCarVariants(brandSlug, modelSlug),
    getSimilarCars(brandSlug, modelSlug),
  ]);
  if (!car?.selectedVariant || car.selectedVariant.slug !== variantSlug) notFound();
  return <VariantDetailPage car={car} variants={variants} similarCars={similarCars} />;
}
