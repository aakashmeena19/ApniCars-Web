import UpcomingCarsCarousel from "@/components/home/UpcomingCarsCarousel";
import { getHomeFeed } from "@/lib/home/home.api";

export default async function UpcomingCarsSectionLive() {
  const feed = await getHomeFeed();
  const cars = feed?.cars.upcoming ?? [];
  if (cars.length === 0) return null;
  return <UpcomingCarsCarousel cars={cars} />;
}

