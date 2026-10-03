import type { Car360ImagesResult, CarDetail, CarFaq, CarImagesResult, CarNewsStory, CarVariantOption } from "./car.types";
import type { HomeCar } from "@/lib/home/home.types";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/public/v1";

interface PublicApiResponse<T> { success: boolean; data: T }

async function getPublicData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, { next: { revalidate: 180 } });
    if (!response.ok) return null;
    const payload = (await response.json()) as PublicApiResponse<T>;
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

function carPath(brandSlug: string, modelSlug: string): string {
  return `/cars/${encodeURIComponent(brandSlug)}/${encodeURIComponent(modelSlug)}`;
}

export function getCarDetail(brandSlug: string, modelSlug: string): Promise<CarDetail | null> {
  return getPublicData<CarDetail>(carPath(brandSlug, modelSlug));
}

export function getCarVariantDetail(brandSlug: string, modelSlug: string, variantSlug: string): Promise<CarDetail | null> {
  return getPublicData<CarDetail>(`${carPath(brandSlug, modelSlug)}/${encodeURIComponent(variantSlug)}`);
}

export async function getCarVariants(brandSlug: string, modelSlug: string): Promise<CarVariantOption[]> {
  return (await getPublicData<CarVariantOption[]>(`${carPath(brandSlug, modelSlug)}/variants`)) ?? [];
}

export async function getCarImages(brandSlug: string, modelSlug: string, page = 1, category?: string): Promise<CarImagesResult | null> {
  const params = new URLSearchParams({ page: String(page), limit: "24" });
  if (category) params.set("category", category);
  return getPublicData<CarImagesResult>(`${carPath(brandSlug, modelSlug)}/images?${params.toString()}`);
}

export function getCar360Images(brandSlug: string, modelSlug: string): Promise<Car360ImagesResult | null> {
  return getPublicData<Car360ImagesResult>(`${carPath(brandSlug, modelSlug)}/360-images`);
}

export function getCar360PreviewImages(brandSlug: string, modelSlug: string): Promise<Car360ImagesResult | null> {
  return getPublicData<Car360ImagesResult>(`${carPath(brandSlug, modelSlug)}/360-images?preview=true`);
}

export async function getCarFaqs(brandSlug: string, modelSlug: string): Promise<CarFaq[]> {
  return (await getPublicData<CarFaq[]>(`${carPath(brandSlug, modelSlug)}/faqs`)) ?? [];
}

export async function getCarNews(brandSlug: string, modelSlug: string): Promise<CarNewsStory[]> {
  return (await getPublicData<CarNewsStory[]>(`${carPath(brandSlug, modelSlug)}/news`)) ?? [];
}

export async function getSimilarCars(brandSlug: string, modelSlug: string): Promise<HomeCar[]> {
  return (await getPublicData<HomeCar[]>(`${carPath(brandSlug, modelSlug)}/similar`)) ?? [];
}
