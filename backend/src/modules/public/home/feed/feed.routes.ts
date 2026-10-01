import { Router } from 'express';
import { publicCache } from '@/core/cache/publicCache';
import { asyncHandler } from '@/core/utils/asyncHandler';
import { getHomeFeed } from './feed.controller';

const router = Router();

router.get('/', publicCache(120), asyncHandler(getHomeFeed));

export default router;
