// src/routes/v1/news.ts
import { Router } from 'express';
import newsCategoryRoute from '@/modules/news/newsCategory/newsCategory.routes';
import newsRoute from '@/modules/news/news/news.routes';

const router = Router();

router.use('/categories', newsCategoryRoute);
router.use('/', newsRoute);

export default router;