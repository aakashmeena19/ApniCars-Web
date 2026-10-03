import type { HomeFeed } from "./home.types";

const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/public/v1";

interface PublicApiResponse<T> { success: boolean; data: T }

export function getPublicUploadUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${new URL(PUBLIC_API_BASE_URL).origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getHomeFeed(): Promise<HomeFeed | null> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}/home`, { next: { revalidate: 120 } });
    if (!response.ok) return null;
    const payload = (await response.json()) as PublicApiResponse<HomeFeed>;
    return payload.success && payload.data ? payload.data : null;
  } catch {
    return null;
  }
}
