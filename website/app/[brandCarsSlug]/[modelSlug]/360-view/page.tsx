import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Car360Viewer from "@/components/cars/Car360Viewer";
import { getCar360Images } from "@/lib/cars/car.api";
import { extractBrandSlug } from "@/lib/cars/car.urls";

export const revalidate = 180;

type PageProps = { params: Promise<{ brandCarsSlug: string; modelSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) return {};
  const data = await getCar360Images(brandSlug, modelSlug);
  if (!data || data.frames.length === 0) return {};
  return { title: `${data.brand.name} ${data.name} 360° View | ApniCars`, description: `Rotate and explore the ${data.brand.name} ${data.name} exterior from every angle.` };
}

export default async function Model360Page({ params }: PageProps) {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) notFound();
  const data = await getCar360Images(brandSlug, modelSlug);
  if (!data || data.frames.length < 2) notFound();
  return <Car360Viewer data={data} />;
}
