const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/public/v1";

interface PublicApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UpcomingCar {
  id: number;
  name: string;
  slug: string;
  brand: { id: number; name: string; slug: string };
  expectedLaunchDate: string | null;
  priceMin: string | null;
  priceMax: string | null;
  coverImageUrl: string | null;
}

export function getPublicUploadUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${new URL(PUBLIC_API_BASE_URL).origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getUpcomingCars(): Promise<UpcomingCar[]> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}/home/cars?type=upcoming&limit=6`, {
      next: { revalidate: 180 },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as PublicApiResponse<UpcomingCar[]>;
    return payload.success && Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}
