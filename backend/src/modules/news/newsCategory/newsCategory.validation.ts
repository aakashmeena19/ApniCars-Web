// src/modules/news/newsCategory/newsCategory.validation.ts

import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const booleanish = z.preprocess((val) => {
  if (typeof val === 'string') return val === 'true';
  return val;
}, z.boolean());

export const newsCategoryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  isActive: booleanish.optional(),
  sortBy: z.enum(['name', 'id', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const newsCategoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createNewsCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50),
  // Required — the frontend always generates/edits this and sends the
  // literal value; the backend no longer auto-generates slugs.
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Slug is required')
    .max(50)
    .regex(slugRegex, 'Slug must be lowercase letters/numbers separated by hyphens (e.g. "reviews")'),
  isActive: z.boolean().default(true),
});
export const updateNewsCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Slug is required')
    .max(50)
    .regex(slugRegex, 'Slug must be lowercase letters/numbers separated by hyphens (e.g. "reviews")'),
  isActive: z.boolean(),
});

// Dedicated status-only payload for the row-level Active/Inactive
// toggle — same pattern as brand.validation.ts's updateBrandStatusSchema.
export const updateNewsCategoryStatusSchema = z.object({
  isActive: z.boolean(),
});

export type NewsCategoryListQueryParsed = z.infer<typeof newsCategoryListQuerySchema>;
export type CreateNewsCategoryParsed = z.infer<typeof createNewsCategorySchema>;
export type UpdateNewsCategoryParsed = z.infer<typeof updateNewsCategorySchema>;
export type UpdateNewsCategoryStatusParsed = z.infer<typeof updateNewsCategoryStatusSchema>;