// src/routes/public/home.ts
import { Router } from 'express';
import BannerRoute from '@/modules/public/home/banner/banner.routes';
import BrandRoute from '@/modules/public/home/brand/brand.routes';
import CarRoute from '@/modules/public/home/car/car.routes';
import CityRoute from '@/modules/public/home/city/city.routes';
import NewsRoute from '@/modules/public/home/news/news.routes';
import TestimonialRoute from '@/modules/public/home/testimonial/testimonial.routes';
import BodyTypeRoute from '@/modules/public/home/bodyType/bodyType.routes';
import FeedRoute from '@/modules/public/home/feed/feed.routes';

const router = Router();

router.use('/', FeedRoute);
router.use('/banners', BannerRoute);
router.use('/brands', BrandRoute);
router.use('/cars', CarRoute);
router.use('/cities', CityRoute);
router.use('/news', NewsRoute);
router.use('/testimonials', TestimonialRoute);
router.use('/body-types', BodyTypeRoute);

export default router;
