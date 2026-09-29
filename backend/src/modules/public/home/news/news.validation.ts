// src/modules/public/home/news/news.validation.ts

import { z } from 'zod';

export const homeNewsListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(6),
});

export type HomeNewsListQueryParsed = z.infer<typeof homeNewsListQuerySchema>;
