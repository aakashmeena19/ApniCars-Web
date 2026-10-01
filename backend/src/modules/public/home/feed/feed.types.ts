import type { PublicBannerRecord } from '../banner/banner.types';
import type { PublicHomeBodyTypeRecord } from '../bodyType/bodyType.types';
import type { PublicHomeBrandRecord } from '../brand/brand.types';
import type { PublicHomeCarRecord } from '../car/car.types';
import type { PublicHomeCityRecord } from '../city/city.types';
import type { PublicHomeNewsRecord } from '../news/news.types';
import type { PublicHomeTestimonialRecord } from '../testimonial/testimonial.types';

export interface PublicHomeFeed {
  banners: PublicBannerRecord[];
  brands: PublicHomeBrandRecord[];
  bodyTypes: PublicHomeBodyTypeRecord[];
  cars: {
    latest: PublicHomeCarRecord[];
    popular: PublicHomeCarRecord[];
    featured: PublicHomeCarRecord[];
    upcoming: PublicHomeCarRecord[];
    electric: PublicHomeCarRecord[];
  };
  cities: PublicHomeCityRecord[];
  news: PublicHomeNewsRecord[];
  testimonials: PublicHomeTestimonialRecord[];
}
