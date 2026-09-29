// src/modules/public/news/news/news.routes.ts
//
// No requireAuth/requirePermission here — this is the public,
// unauthenticated API for the website. Response is cached for 2 min.

import { Router } from 'express';
import { asyncHandler } from '@/core/utils/asyncHandler';
import { publicCache } from '@/core/cache/publicCache';
import { getPublicNews, getRelatedNews, getNewsCategories } from './news.controller';

const router = Router();

// Registered before the 1-segment /:categorySlug route below — otherwise
// Express would match "/categories" as categorySlug="categories" instead
// of reaching this literal route.
router.get('/categories', publicCache(300), asyncHandler(getNewsCategories));
router.get('/:categorySlug/:newsSlug', publicCache(120), asyncHandler(getPublicNews));
// Registered after the 2-segment detail route above — Express only falls
// through to this 1-segment route when the URL doesn't have a second
// segment, so there's no ambiguity between the two.
router.get('/:categorySlug', publicCache(120), asyncHandler(getRelatedNews));

export default router;
