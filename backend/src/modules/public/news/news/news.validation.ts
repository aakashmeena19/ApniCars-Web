// src/modules/public/news/news/news.validation.ts

import { z } from 'zod';

export const newsDetailParamSchema = z.object({
  categorySlug: z.string().trim().min(1),
  newsSlug: z.string().trim().min(1),
});

export const categorySlugParamSchema = z.object({
  categorySlug: z.string().trim().min(1),
});

// Shared by two callers: the news detail page's "more from this
// category" widget (small limit + exclude, page always 1) and the
// /news/[categorySlug] listing page's "Load more" pagination (no
// exclude, page increments).
export const relatedNewsQuerySchema = z.object({
  exclude: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(4),
});

export type NewsDetailParamParsed = z.infer<typeof newsDetailParamSchema>;
export type CategorySlugParamParsed = z.infer<typeof categorySlugParamSchema>;
export type RelatedNewsQueryParsed = z.infer<typeof relatedNewsQuerySchema>;
