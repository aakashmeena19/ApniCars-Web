// src/modules/public/home/news/news.service.ts

import { prisma } from '@/prisma/client';
import type { HomeNewsListQueryParsed } from './news.validation';
import type { PublicHomeNewsRecord } from './news.types';

const HOME_NEWS_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  readTimeMinutes: true,
  publishedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true } },
} as const;

// Only "published" + isActive news are public — draft/scheduled
// pieces stay invisible even though they already exist in the table.
export async function listHomeNews(query: HomeNewsListQueryParsed): Promise<PublicHomeNewsRecord[]> {
  const { limit } = query;

  const news = await prisma.news.findMany({
    where: { status: 'published', isActive: true },
    select: HOME_NEWS_SELECT,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  return news.map((news) => ({
    ...news,
    publishedAt: news.publishedAt?.toISOString() ?? null,
  }));
}
