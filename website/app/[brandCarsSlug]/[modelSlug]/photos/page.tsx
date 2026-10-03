import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, ChevronRight, Images, Palette } from "lucide-react";
import CarPhotoGallery from "@/components/cars/CarPhotoGallery";
import { getCarImages } from "@/lib/cars/car.api";
import { extractBrandSlug, getBrandCarsPath, getModelPath } from "@/lib/cars/car.urls";

export const revalidate = 180;

type PageProps = { params: Promise<{ brandCarsSlug: string; modelSlug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) return {};
  const gallery = await getCarImages(brandSlug, modelSlug);
  if (!gallery) return {};
  return { title: `${gallery.brand.name} ${gallery.name} Images & Colours | ApniCars`, description: `View exterior, interior and colour images of the ${gallery.brand.name} ${gallery.name}.` };
}

export default async function PhotosPage({ params }: PageProps) {
  const { brandCarsSlug, modelSlug } = await params;
  const brandSlug = extractBrandSlug(brandCarsSlug);
  if (!brandSlug) notFound();
  const gallery = await getCarImages(brandSlug, modelSlug);
  if (!gallery) notFound();
  const title = `${gallery.brand.name} ${gallery.name}`;
  return <main className="min-h-screen bg-[#f4f7f5] text-[#10231b] dark:bg-[#071813] dark:text-white">
    <section className="border-b border-white/10 bg-[#09281f] text-white"><div className="page-shell py-9 sm:py-12">
      <nav className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#708078] dark:text-white/45"><Link href="/brands">Brands</Link><ChevronRight size={11} /><Link href={getBrandCarsPath(gallery.brand.slug)}>{gallery.brand.name}</Link><ChevronRight size={11} /><Link href={getModelPath(gallery.brand.slug, modelSlug)}>{gallery.name}</Link><ChevronRight size={11} /><span>Photos</span></nav>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-5"><div><p className="flex items-center gap-2 text-[10px] font-semibold text-[#c9ff49]"><Camera size={14} /> Automotive visual archive</p><h1 className="mt-2 text-[31px] font-semibold sm:text-[42px]">Explore {title}</h1><p className="mt-3 max-w-[620px] text-[11px] leading-5 text-white/52">Exterior stance, cabin details, colour finishes and every available angle in one curated gallery.</p></div><div className="flex gap-6 border-l border-white/15 pl-5"><div><Images size={15} className="text-[#c9ff49]" /><strong className="mt-2 block text-[18px]">{gallery.pagination.total}</strong><span className="text-[9px] text-white/42">Photos</span></div><div><Palette size={15} className="text-[#c9ff49]" /><strong className="mt-2 block text-[18px]">{gallery.colors.length}</strong><span className="text-[9px] text-white/42">Colours</span></div></div></div>
    </div></section>
    <section className="page-shell py-8 sm:py-12">{gallery.images.length > 0 ? <CarPhotoGallery initialImages={gallery.images} categories={gallery.categories} initialTotal={gallery.pagination.total} colors={gallery.colors} brandSlug={gallery.brand.slug} modelSlug={modelSlug} carName={title} /> : <div className="rounded-[8px] border border-dashed border-black/15 bg-white py-20 text-center dark:border-white/15 dark:bg-[#102720]"><Camera size={28} className="mx-auto text-[#789087]" /><h2 className="mt-4 text-[20px] font-semibold">Photos coming soon</h2><p className="mt-2 text-[10px] text-[#718079]">The complete gallery has not been published yet.</p></div>}</section>
  </main>;
}
