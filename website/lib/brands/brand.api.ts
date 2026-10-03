import type { BrandCarsQuery, BrandCarsResult, BrandNewsStory, BrandSummary } from "./brand.types";
import type { HomeCar } from "@/lib/home/home.types";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/public/v1";

interface PublicApiResponse<T> { success: boolean; data: T }

async function getPublicData<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, { next: { revalidate } });
    if (!response.ok) return null;
    const payload = (await response.json()) as PublicApiResponse<T>;
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

export async function getBrandsWithCounts(): Promise<BrandSummary[]> {
  return (await getPublicData<BrandSummary[]>("/brands/with-counts", 300)) ?? [];
}

export async function getBrandCars(slug: string, query: BrandCarsQuery = {}): Promise<BrandCarsResult | null> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const suffix = params.size > 0 ? `?${params.toString()}` : "";
  return getPublicData<BrandCarsResult>(`/brands/${encodeURIComponent(slug)}/cars${suffix}`, 180);
}

export async function getBrandNews(slug: string): Promise<BrandNewsStory[]> {
  return (await getPublicData<BrandNewsStory[]>(`/brands/${encodeURIComponent(slug)}/news`, 300)) ?? [];
}

export async function getBrandUpcomingCars(slug: string): Promise<HomeCar[]> {
  const params = new URLSearchParams({ type: "upcoming", brand: slug, limit: "8" });
  return (await getPublicData<HomeCar[]>(`/home/cars?${params.toString()}`, 180)) ?? [];
}
