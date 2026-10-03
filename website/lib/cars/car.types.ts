export interface CarVariantOption {
  id: number;
  slug: string | null;
  variantName: string;
  price: string;
  isTopSeller: boolean;
}

export interface CarFeatureGroup {
  categoryId: number | null;
  categoryName: string;
  items: { id: number; name: string; value: string | null }[];
}

export interface CarVariantDetail {
  id: number;
  slug: string | null;
  variantName: string;
  price: string;
  seatingCapacity: number;
  transmission: string | null;
  isElectric: boolean;
  ice: Record<string, string | number | boolean | null> | null;
  electric: Record<string, string | number | boolean | null> | null;
  dimensions: Record<string, string | number | null>;
  features: CarFeatureGroup[];
}

export interface CarVariantComparisonFeature {
  id: number;
  name: string;
  value: string | null;
}

export interface CarVariantComparisonOption {
  id: number;
  slug: string;
  variantName: string;
  price: string;
  priceDifference: string;
  seatingCapacity: number;
  transmission: string | null;
  powertrain: {
    type: "ice" | "electric";
    fuelType: string | null;
    displacementCc: number | null;
    batteryCapacity: string | null;
    powerPs: number | null;
    claimedEfficiency: string | null;
    claimedRange: number | null;
  };
  featuresAddedByCurrent: CarVariantComparisonFeature[];
  featuresAddedByAlternative: CarVariantComparisonFeature[];
  currentFeatureDifferenceCount: number;
  alternativeFeatureDifferenceCount: number;
}

export interface CarVariantComparison {
  lower: CarVariantComparisonOption | null;
  upper: CarVariantComparisonOption | null;
}

export interface CarImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  angle: string | null;
  colorId: number | null;
  category: string | null;
  caption: string | null;
}

export interface CarColor {
  id: number;
  colorName: string;
  imageUrl: string | null;
  additionalCost: string | null;
  shades: { colorHex: string; sortOrder: number }[];
}

export interface CarDetail {
  id: number;
  name: string;
  slug: string;
  brand: { id: number; name: string; slug: string; logoUrl: string | null };
  bodyType: { id: number; name: string; slug: string } | null;
  launchStatus: string;
  expectedLaunchDate: string | null;
  priceMin: string | null;
  priceMax: string | null;
  ratingAvg: string | null;
  coverImageUrl: string | null;
  has360View: boolean;
  variantOptions: CarVariantOption[];
  variantCount: number;
  selectedVariant: CarVariantDetail | null;
  variantComparison: CarVariantComparison | null;
  images: CarImage[];
  colors: CarColor[];
}

export interface Car360ImagesResult {
  name: string;
  slug: string;
  brand: { name: string; slug: string };
  frames: { id: number; imageUrl: string; angle: string | null }[];
}

export interface CarImagesResult {
  name: string;
  brand: { name: string; slug: string };
  images: CarImage[];
  colors: CarColor[];
  categories: string[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CarFaq {
  id: number;
  question: string;
  answer: string;
}

export interface CarNewsStory {
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
