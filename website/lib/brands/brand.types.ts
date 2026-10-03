import type { HomeCar, HomeNewsStory } from "@/lib/home/home.types";

export interface BrandSummary {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
  count: number;
}

export interface BrandCarsFilters {
  bodyTypes: { id: number; name: string; slug: string; count: number }[];
  fuelTypes: { value: string; label: string; count: number }[];
  priceRange: { min: string; max: string };
}

export interface BrandCarsResult {
  brand: Omit<BrandSummary, "count">;
  cars: HomeCar[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: BrandCarsFilters;
}

export type BrandNewsStory = HomeNewsStory;

export interface BrandCarsQuery {
  page?: number;
  limit?: number;
  bodyType?: string;
  fuelType?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "popularity" | "price-asc" | "price-desc" | "rating";
}
