// src/modules/news/newsCategory/newsCategory.controller.ts

import { Request, Response } from 'express';
import { ApiError } from '@/core/errors/ApiError';
import { sendSuccess, sendPaginated } from '@/core/utils/sendResponse';
import { getClientIp } from '@/core/utils/getClientIp';
import * as newsCategoryService from './newsCategory.service';
import {
  newsCategoryListQuerySchema,
  newsCategoryIdParamSchema,
  createNewsCategorySchema,
  updateNewsCategorySchema,
  updateNewsCategoryStatusSchema,
} from './newsCategory.validation';

export async function getNewsCategories(req: Request, res: Response) {
  const query = newsCategoryListQuerySchema.parse(req.query);
  const result = await newsCategoryService.listNewsCategories(query);
  return sendPaginated(res, result.items, result.pagination, 'News categories fetched successfully');
}

export async function getNewsCategoryById(req: Request, res: Response) {
  const { id } = newsCategoryIdParamSchema.parse(req.params);
  const category = await newsCategoryService.getNewsCategoryById(id);
  return sendSuccess(res, category, 'News category fetched successfully');
}

export async function createNewsCategory(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const input = createNewsCategorySchema.parse(req.body);
  const category = await newsCategoryService.createNewsCategory(input, req.auth.id, getClientIp(req));
  return sendSuccess(res, category, 'News category created successfully', 201);
}

export async function updateNewsCategory(req: Request, res: Response) {
  const { id } = newsCategoryIdParamSchema.parse(req.params);
  const input = updateNewsCategorySchema.parse(req.body);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const category = await newsCategoryService.updateNewsCategory(id, input, req.auth.id, getClientIp(req));
  return sendSuccess(res, category, 'News category updated successfully');
}

// Dedicated quick-toggle route for the row-level Active/Inactive switch.
export async function updateNewsCategoryStatus(req: Request, res: Response) {
  const { id } = newsCategoryIdParamSchema.parse(req.params);
  const { isActive } = updateNewsCategoryStatusSchema.parse(req.body);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const category = await newsCategoryService.updateNewsCategoryStatus(id, isActive, req.auth.id, getClientIp(req));
  return sendSuccess(res, category, 'News category status updated successfully');
}

export async function deleteNewsCategory(req: Request, res: Response) {
  const { id } = newsCategoryIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const result = await newsCategoryService.deleteNewsCategory(id, req.auth.id, getClientIp(req));
  return sendSuccess(res, null, result.message);
}