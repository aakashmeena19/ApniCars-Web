// src/modules/news/newsCategory/newsCategory.routes.ts

import { Router } from 'express';
import { requireAuth } from '@/core/middleware/auth';
import { requirePermission } from '@/core/middleware/requirePermission';
import { asyncHandler } from '@/core/utils/asyncHandler';
import {
  getNewsCategories,
  getNewsCategoryById,
  createNewsCategory,
  updateNewsCategory,
  updateNewsCategoryStatus,
  deleteNewsCategory,
} from './newsCategory.controller';

const router = Router();

// Every news-category-management route requires a logged-in admin.
router.use(requireAuth(['admin']));

router.get('/', requirePermission('news-categories.view'), asyncHandler(getNewsCategories));
router.get('/:id', requirePermission('news-categories.view'), asyncHandler(getNewsCategoryById));
router.post('/', requirePermission('news-categories.create'), asyncHandler(createNewsCategory));
router.patch('/:id', requirePermission('news-categories.update'), asyncHandler(updateNewsCategory));
// Dedicated quick-toggle route for the row-level status switch (mirrors
// brand.routes.ts's PATCH /:id/status pattern).
router.patch('/:id/status', requirePermission('news-categories.update'), asyncHandler(updateNewsCategoryStatus));
router.delete('/:id', requirePermission('news-categories.delete'), asyncHandler(deleteNewsCategory));

export default router;