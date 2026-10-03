import type { HomeCar } from "./home.types";

export function formatPrice(value: string | null): string | null {
  if (!value) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  if (amount >= 10_000_000) return `Rs. ${(amount / 10_000_000).toFixed(amount % 10_000_000 === 0 ? 0 : 2)} Cr`;
  return `Rs. ${(amount / 100_000).toFixed(amount % 100_000 === 0 ? 0 : 2)} Lakh`;
}

export function formatPriceRange(car: Pick<HomeCar, "priceMin" | "priceMax">): string {
  const min = formatPrice(car.priceMin);
  const max = formatPrice(car.priceMax);
  if (min && max) return `${min} - ${max.replace("Rs. ", "")}`;
  return min ?? max ?? "Price to be announced";
}

export function formatLaunchDate(value: string | null): string {
  if (!value) return "Launch date to be announced";
  return `Expected ${new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value))}`;
}

export function getCarMeta(car: HomeCar): string {
  const details = [car.bodyType?.name, car.specs?.seatingCapacity ? `${car.specs.seatingCapacity} seats` : null];
  return details.filter(Boolean).join(" | ") || car.brand.name;
}
