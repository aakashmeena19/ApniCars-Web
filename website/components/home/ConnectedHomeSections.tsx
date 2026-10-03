import BrowseBrandsSection from "@/components/home/BrowseBrandsSection";
import CarNewsSection from "@/components/home/CarNewsSection";
import CompareCarsSection from "@/components/home/CompareCarsSection";
import CustomerStorySection from "@/components/home/CustomerStorySection";
import DynamicCarRail from "@/components/home/DynamicCarRail";
import ElectricLineupSection from "@/components/home/ElectricLineupSection";
import HeroSection from "@/components/home/HeroSection";
import PopularCitiesSection from "@/components/home/PopularCitiesSection";
import PopularSpotlightSection from "@/components/home/PopularSpotlightSection";
import RideCategoriesSection from "@/components/home/RideCategoriesSection";
import UpcomingCarsCarousel from "@/components/home/UpcomingCarsCarousel";
import WhyApnicarsSection from "@/components/home/WhyApnicarsSection";
import { getHomeFeed } from "@/lib/home/home.api";

export default async function ConnectedHomeSections() {
  const feed = await getHomeFeed();
  const cars = feed?.cars;

  return (
    <main>
      <HeroSection banners={feed?.banners ?? []} brands={feed?.brands ?? []} bodyTypes={feed?.bodyTypes ?? []} />
      <RideCategoriesSection bodyTypes={feed?.bodyTypes ?? []} />
      <DynamicCarRail eyebrow="Fresh arrivals" title="Latest cars" cars={cars?.latest ?? []} href="/cars?sort=latest" tone="soft" badge="New" />
      <PopularSpotlightSection car={cars?.popular[0] ?? null} />
      <DynamicCarRail eyebrow="Featured vehicles" title="Our featured cars" cars={cars?.featured ?? []} href="/cars?featured=true" tone="dark" badge="Featured" />
      <DynamicCarRail eyebrow="Popular vehicles" title="Choose your perfect car" cars={cars?.popular ?? []} href="/popular-cars" />
      {(cars?.upcoming.length ?? 0) > 0 && <UpcomingCarsCarousel cars={cars?.upcoming ?? []} />}
      <BrowseBrandsSection brands={feed?.brands ?? []} />
      <ElectricLineupSection cars={cars?.electric ?? []} />
      <CompareCarsSection cars={cars?.popular ?? []} />
      <PopularCitiesSection cities={feed?.cities ?? []} />
      <CarNewsSection stories={feed?.news ?? []} />
      <WhyApnicarsSection />
      <CustomerStorySection stories={feed?.testimonials ?? []} />
    </main>
  );
}
