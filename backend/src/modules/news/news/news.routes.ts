// src/modules/news/news/news.routes.ts

import { Router } from 'express';
import { requireAuth } from '@/core/middleware/auth';
import { requirePermission } from '@/core/middleware/requirePermission';
import { imageUploader } from '@/core/middleware/upload.middleware';
import { asyncHandler } from '@/core/utils/asyncHandler';
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  updateNewsStatus,
  uploadNewsCoverImage,
  uploadNewsContentImage,
  deleteNewsContentImage,
  deleteNews,
} from './news.controller';

const router = Router();

// Every news-management route requires a logged-in admin.
router.use(requireAuth(['admin']));

// Rich-text editor image endpoints — mounted before the generic /:id
// routes below so "upload-image" is never mistaken for an :id param.
router.post(
  '/upload-image',
  requirePermission('news.create'),
  imageUploader('news/content').single('image'),
  asyncHandler(uploadNewsContentImage),
);
router.delete('/upload-image', requirePermission('news.update'), asyncHandler(deleteNewsContentImage));

router.get('/', requirePermission('news.view'), asyncHandler(getNews));
router.get('/:id', requirePermission('news.view'), asyncHandler(getNewsById));

router.post(
  '/',
  requirePermission('news.create'),
  imageUploader('news').single('coverImage'),
  asyncHandler(createNews),
);

router.patch(
  '/:id',
  requirePermission('news.update'),
  imageUploader('news').single('coverImage'),
  asyncHandler(updateNews),
);

// Dedicated quick-toggle route for the row-level status switch (mirrors
// offer.routes.ts's PATCH /:id/status pattern).
router.patch('/:id/status', requirePermission('news.update'), asyncHandler(updateNewsStatus));

router.patch(
  '/:id/cover-image',
  requirePermission('news.update'),
  imageUploader('news').single('coverImage'),
  asyncHandler(uploadNewsCoverImage),
);

router.delete('/:id', requirePermission('news.delete'), asyncHandler(deleteNews));

export default router;