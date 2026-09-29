// src/modules/news/news/news.validation.ts

import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const NEWS_STATUSES = ['draft', 'scheduled', 'published'] as const;

const booleanish = z.preprocess((val) => {
  if (typeof val === 'string') return val === 'true';
  return val;
}, z.boolean());
const idArray = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return [val];
    }
  }
  return [val];
}, z.array(z.coerce.number().int().positive()));

export const newsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  brandId: z.coerce.number().int().positive().optional(),
  modelId: z.coerce.number().int().positive().optional(),
  status: z.enum(NEWS_STATUSES).optional(),
  isActive: booleanish.optional(),
  sortBy: z.enum(['id', 'title', 'createdAt', 'publishedAt', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const newsIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const newsShape = {
  categoryId: z.coerce.number().int().positive('Category is required'),
  authorId: z.coerce.number().int().positive('Author is required'),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  // Required — the frontend always generates/edits this and sends the
  // literal value; the backend no longer auto-generates slugs.
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Slug is required')
    .max(200)
    .regex(slugRegex, 'Slug must be lowercase letters/numbers separated by hyphens'),
  excerpt: z.string().trim().max(300).nullable().optional(),
  body: z.string().trim().min(1, 'News content is required'),
  readTimeMinutes: z.coerce.number().int().nonnegative().nullable().optional(),
  status: z.enum(NEWS_STATUSES).default('draft'),
  isActive: booleanish,
  scheduledAt: z.coerce.date().nullable().optional(),
  metaTitle: z.string().trim().max(160).nullable().optional(),
  metaDescription: z.string().trim().max(300).nullable().optional(),
  metaKeywords: z.string().trim().max(255).nullable().optional(),
  // Open Graph image shown when the news link is shared on social
  // platforms — a plain URL field (unlike coverImageUrl, which is an
  // uploaded file), since it commonly points at an already-hosted asset.
  ogImageUrl: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().trim().url('Must be a valid URL').max(255).nullable().optional(),
  ),
  // Multi-select — an news can cover more than one brand/model
  // (comparison/roundup pieces), hence arrays instead of single ids.
  brandIds: idArray.default([]),
  modelIds: idArray.default([]),
};

// Shared by createNewsSchema/updateNewsSchema below — kept as a plain
// function (not a generic schema-wrapping helper) because calling
// `.superRefine()` through a generic `<T extends z.ZodTypeAny>` wrapper loses
// Zod's output-type inference entirely (TypeScript falls back to the bare
// `ZodTypeAny` constraint for contextual typing), which silently turned every
// field on CreateNewsParsed/UpdateNewsParsed into `any`. Calling
// `.superRefine()` directly on each concrete schema below (same pattern as
// updateNewsStatusSchema) keeps full field-level type inference intact.
function scheduleRule(data: { status: string; scheduledAt?: Date | null }, ctx: z.RefinementCtx) {
  if (data.status === 'scheduled') {
    if (!data.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'scheduledAt is required when status is "scheduled"',
        path: ['scheduledAt'],
      });
    } else if (data.scheduledAt.getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'scheduledAt must be a future date/time',
        path: ['scheduledAt'],
      });
    }
  }
}

export const createNewsSchema = z.object(newsShape).superRefine(scheduleRule);
export const updateNewsSchema = z.object(newsShape).superRefine(scheduleRule);

export const updateNewsStatusSchema = z
  .object({
    status: z.enum(NEWS_STATUSES),
    scheduledAt: z.coerce.date().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'scheduled') {
      if (!data.scheduledAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'scheduledAt is required when status is "scheduled"',
          path: ['scheduledAt'],
        });
      } else if (data.scheduledAt.getTime() <= Date.now()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'scheduledAt must be a future date/time',
          path: ['scheduledAt'],
        });
      }
    }
  });

export type NewsListQueryParsed = z.infer<typeof newsListQuerySchema>;
export type CreateNewsParsed = z.infer<typeof createNewsSchema>;
export type UpdateNewsParsed = z.infer<typeof updateNewsSchema>;
export type UpdateNewsStatusParsed = z.infer<typeof updateNewsStatusSchema>;