// src/modules/public/home/news/news.routes.ts
//
// No requireAuth/requirePermission here — this is the public,
// unauthenticated API for the website. Response is cached for 2 min.

import { Router } from 'express';
import { asyncHandler } from '@/core/utils/asyncHandler';
import { publicCache } from '@/core/cache/publicCache';
import { getHomeNews } from './news.controller';

const router = Router();

router.get('/', publicCache(120), asyncHandler(getHomeNews));

export default router;
