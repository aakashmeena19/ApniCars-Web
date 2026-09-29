// src/modules/public/home/news/news.controller.ts

import { Request, Response } from 'express';
import { sendSuccess } from '@/core/utils/sendResponse';
import { homeNewsListQuerySchema } from './news.validation';
import * as newsService from './news.service';

// GET /api/public/v1/home/news
export async function getHomeNews(req: Request, res: Response) {
  const query = homeNewsListQuerySchema.parse(req.query);
  const news = await newsService.listHomeNews(query);
  return sendSuccess(res, news, 'News fetched successfully');
}
