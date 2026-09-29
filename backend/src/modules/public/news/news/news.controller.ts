// src/modules/public/news/news/news.controller.ts

import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '@/core/utils/sendResponse';
import { newsDetailParamSchema, categorySlugParamSchema, relatedNewsQuerySchema } from './news.validation';
import * as newsService from './news.service';

// GET /api/public/v1/news/categories
export async function getNewsCategories(_req: Request, res: Response) {
  const categories = await newsService.listNewsCategories();
  return sendSuccess(res, categories, 'News categories fetched successfully');
}

// GET /api/public/v1/news/:categorySlug/:newsSlug
export async function getPublicNews(req: Request, res: Response) {
  const { categorySlug, newsSlug } = newsDetailParamSchema.parse(req.params);
  const news = await newsService.getPublicNewsBySlug(categorySlug, newsSlug);
  return sendSuccess(res, news, 'News fetched successfully');
}

// GET /api/public/v1/news/:categorySlug — "More from this category"
// widget (small fixed limit) and the /news/[categorySlug] listing page's
// "Load more" pagination (page increments) share this one route.
export async function getRelatedNews(req: Request, res: Response) {
  const { categorySlug } = categorySlugParamSchema.parse(req.params);
  const query = relatedNewsQuerySchema.parse(req.query);
  const { items, pagination } = await newsService.listRelatedNews(categorySlug, query);
  return sendPaginated(res, items, pagination, 'Related news fetched successfully');
}
