// src/modules/public/news/news/news.service.ts

import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client';
import { ApiError } from '@/core/errors/ApiError';
import type { PublicNewsDetail, PublicNewsCategory } from './news.types';
import type { PublicHomeNewsRecord } from '@/modules/public/home/news/news.types';
import type { RelatedNewsQueryParsed } from './news.validation';

export interface PaginatedNews {
  items: PublicHomeNewsRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const PUBLIC_NEWS_SUMMARY_SELECT = {
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

const PUBLIC_NEWS_DETAIL_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  body: true,
  coverImageUrl: true,
  readTimeMinutes: true,
  publishedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true } },
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImageUrl: true,
} as const;

// Powers the News nav dropdown — every active category, alphabetical.
export async function listNewsCategories(): Promise<PublicNewsCategory[]> {
  return prisma.newsCategory.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });
}

// Matches only when ALL of these hold: the news itself is
// published+active, AND its category is active — a de-activated category
// hides every news under it from the public site even if the news
// row itself is still "published".
export async function getPublicNewsBySlug(
  categorySlug: string,
  newsSlug: string,
): Promise<PublicNewsDetail> {
  const news = await prisma.news.findFirst({
    where: {
      slug: newsSlug,
      status: 'published',
      isActive: true,
      category: { slug: categorySlug, isActive: true },
    },
    select: PUBLIC_NEWS_DETAIL_SELECT,
  });

  if (!news) {
    throw ApiError.notFound('News not found');
  }

  return { ...news, publishedAt: news.publishedAt?.toISOString() ?? null };
}

// "More from this category" widget AND the /news/[categorySlug] listing
// page both go through here — same category, active, published, and
// (when reading a specific news) excludes that one via its slug.
// Page-based pagination (skip/take + a total count) so the listing page
// can offer "Load more" without ever pulling the whole category at once.
export async function listRelatedNews(categorySlug: string, query: RelatedNewsQueryParsed): Promise<PaginatedNews> {
  const { exclude, limit, page } = query;

  const where: Prisma.NewsWhereInput = {
    status: 'published',
    isActive: true,
    category: { slug: categorySlug, isActive: true },
    ...(exclude ? { slug: { not: exclude } } : {}),
  };

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where,
      select: PUBLIC_NEWS_SUMMARY_SELECT,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.news.count({ where }),
  ]);

  return {
    items: news.map((news) => ({ ...news, publishedAt: news.publishedAt?.toISOString() ?? null })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}
