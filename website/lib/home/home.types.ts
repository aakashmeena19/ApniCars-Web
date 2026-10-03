export interface HomeBanner {
  id: number;
  tagLabel: string;
  heading: string;
  highlightText: string;
  description: string;
  mediaType: number;
  imageUrl: string | null;
  videoUrl: string | null;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
}

export interface HomeBrand {
  id: number;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export interface HomeBodyType {
  id: number;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface HomeCar {
  id: number;
  name: string;
  slug: string;
  brand: HomeBrand;
  bodyType: { id: number; name: string } | null;
  launchStatus: string;
  expectedLaunchDate: string | null;
  priceMin: string | null;
  priceMax: string | null;
  ratingAvg: string | null;
  coverImageUrl: string | null;
  isElectric: boolean;
  specs: {
    seatingCapacity: number | null;
    engineCc: number | null;
    mileage: string | null;
    powerPs: number | null;
    torqueNm: number | null;
    batteryCapacity: string | null;
    range: number | null;
    chargeTime: string | null;
    topSpeedKmph: number | null;
  } | null;
}

export interface HomeCity { id: number; name: string; slug: string; logoUrl: string | null }

export interface HomeNewsStory {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string };
}

export interface HomeTestimonial {
  id: number;
  customerName: string;
  customerCity: string | null;
  photoUrl: string | null;
  rating: string | null;
  quote: string;
  createdAt: string;
}

export interface HomeFeed {
  banners: HomeBanner[];
  brands: HomeBrand[];
  bodyTypes: HomeBodyType[];
  cars: { latest: HomeCar[]; popular: HomeCar[]; featured: HomeCar[]; upcoming: HomeCar[]; electric: HomeCar[] };
  cities: HomeCity[];
  news: HomeNewsStory[];
  testimonials: HomeTestimonial[];
}
