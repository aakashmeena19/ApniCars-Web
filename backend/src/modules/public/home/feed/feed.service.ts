import { listActiveBanners } from '../banner/banner.service';
import { listHomeBodyTypes } from '../bodyType/bodyType.service';
import { listHomeBrands } from '../brand/brand.service';
import { listHomeCars } from '../car/car.service';
import { listHomeCities } from '../city/city.service';
import { listHomeNews } from '../news/news.service';
import { listHomeTestimonials } from '../testimonial/testimonial.service';
import type { PublicHomeFeed } from './feed.types';

export async function getPublicHomeFeed(): Promise<PublicHomeFeed> {
  const [banners, brands, bodyTypes, latest, popular, featuredCars, upcoming, electric, cities, news, testimonials] =
    await Promise.all([
      listActiveBanners(),
      listHomeBrands({ limit: 12 }),
      listHomeBodyTypes({ limit: 10 }),
      listHomeCars({ type: 'latest', limit: 8 }),
      listHomeCars({ type: 'popular', limit: 8 }),
      listHomeCars({ type: 'featured', limit: 6 }),
      listHomeCars({ type: 'upcoming', limit: 6 }),
      listHomeCars({ type: 'electric', limit: 6 }),
      listHomeCities({ limit: 8 }),
      listHomeNews({ limit: 6 }),
      listHomeTestimonials({ limit: 6 }),
    ]);

  return {
    banners,
    brands,
    bodyTypes,
    cars: {
      latest,
      popular,
      featured: featuredCars.length > 0 ? featuredCars : popular.slice(0, 6),
      upcoming,
      electric,
    },
    cities,
    news,
    testimonials,
  };
}
