// src/modules/news/news/news.controller.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '@/core/errors/ApiError';
import { sendSuccess, sendPaginated } from '@/core/utils/sendResponse';
import { buildPublicPath, deleteUploadedFile } from '@/core/utils/fileStorage.util';
import { createLog } from '@/core/utils/createLog';
import { getClientIp } from '@/core/utils/getClientIp';
import * as newsService from './news.service';
import {
  newsListQuerySchema,
  newsIdParamSchema,
  createNewsSchema,
  updateNewsSchema,
  updateNewsStatusSchema,
} from './news.validation';

export async function getNews(req: Request, res: Response) {
  const query = newsListQuerySchema.parse(req.query);
  const result = await newsService.listNews(query);
  return sendPaginated(res, result.items, result.pagination, 'News fetched successfully');
}

export async function getNewsById(req: Request, res: Response) {
  const { id } = newsIdParamSchema.parse(req.params);
  const news = await newsService.getNewsById(id);

  if (req.auth) {
    await createLog({
      adminId: req.auth.id,
      description: `Viewed news "${news.title}" (id ${id})`,
    });
  }

  return sendSuccess(res, news, 'News fetched successfully');
}

// Cover image is optional on create — a draft can be saved without one
// and have it added later via the dedicated /:id/cover-image route.
export async function createNews(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  try {
    const input = createNewsSchema.parse(req.body);
    const news = await newsService.createNews(input, req.auth.id, req.file?.filename, getClientIp(req));
    return sendSuccess(res, news, 'News created successfully', 201);
  } catch (err) {
    if (req.file) {
      await deleteUploadedFile(buildPublicPath('news', req.file.filename));
    }
    throw err;
  }
}

export async function updateNews(req: Request, res: Response) {
  const { id } = newsIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  try {
    const input = updateNewsSchema.parse(req.body);
    // Cover image (if any) rides along in the same call now — it's
    // saved inside the same transaction as the rest of the fields, not
    // as a separate follow-up write.
    const news = await newsService.updateNews(id, input, req.auth.id, req.file?.filename, getClientIp(req));
    return sendSuccess(res, news, 'News updated successfully');
  } catch (err) {
    if (req.file) {
      await deleteUploadedFile(buildPublicPath('news', req.file.filename));
    }
    throw err;
  }
}

export async function updateNewsStatus(req: Request, res: Response) {
  const { id } = newsIdParamSchema.parse(req.params);
  const input = updateNewsStatusSchema.parse(req.body);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const news = await newsService.updateNewsStatus(id, input, req.auth.id, getClientIp(req));
  return sendSuccess(res, news, 'News status updated successfully');
}

export async function uploadNewsCoverImage(req: Request, res: Response) {
  const { id } = newsIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }
  if (!req.file) {
    throw ApiError.badRequest('No image file received (expected field name "coverImage")');
  }

  const news = await newsService.uploadNewsCoverImage(id, req.file.filename, req.auth.id, getClientIp(req));
  return sendSuccess(res, news, 'News cover image updated successfully');
}

export async function deleteNews(req: Request, res: Response) {
  const { id } = newsIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const result = await newsService.deleteNews(id, req.auth.id, getClientIp(req));
  return sendSuccess(res, null, result.message);
}

// ── Rich-text editor content images ──────────────────────────────────
// These back the embedded Editor component (components/common/Editor) —
// images pasted/dropped/inserted *inside* an news's body, as opposed
// to the one-per-news coverImageUrl handled above. Deliberately not
// tied to a specific news id: the editor can upload an image before
// the news itself has been saved (e.g. while still filling out a
// brand-new draft).
export async function uploadNewsContentImage(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.unauthorized();
  }
  if (!req.file) {
    throw ApiError.badRequest('No image file received (expected field name "image")');
  }

  const url = buildPublicPath('news/content', req.file.filename);
  return sendSuccess(res, { url }, 'Image uploaded successfully', 201);
}

const deleteContentImageSchema = z.object({ path: z.string().trim().min(1) });

export async function deleteNewsContentImage(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const { path } = deleteContentImageSchema.parse(req.body);
  // Best-effort — the editor calls this when an image is removed from
  // the body while drafting; a missing file (already gone, or never
  // actually saved) isn't an error worth surfacing to the admin.
  await deleteUploadedFile(path);
  return sendSuccess(res, null, 'Image deleted successfully');
}