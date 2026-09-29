// src/routes/public/news.ts
import { Router } from 'express';
import NewsRoute from '@/modules/public/news/news/news.routes';

const router = Router();

router.use('/', NewsRoute);

export default router;
