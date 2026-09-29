// src/modules/news/news/news.service.ts

import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client';
import { ApiError } from '@/core/errors/ApiError';
import { createLog } from '@/core/utils/createLog';
import { buildPublicPath, deleteUploadedFile } from '@/core/utils/fileStorage.util';
import type {
  NewsListQueryParsed,
  CreateNewsParsed,
  UpdateNewsParsed,
  UpdateNewsStatusParsed,
} from './news.validation';
import type { NewsListItem, NewsUploadCoverResult } from './news.types';

const NEWS_SELECT = {
  id: true,
  categoryId: true,
  category: { select: { id: true, name: true, slug: true } },
  authorId: true,
  author: { select: { id: true, name: true } },
  createdBy: true,
  createdByAdmin: { select: { id: true, name: true } },
  updatedBy: true,
  updatedByAdmin: { select: { id: true, name: true } },
  title: true,
  slug: true,
  excerpt: true,
  body: true,
  coverImageUrl: true,
  readTimeMinutes: true,
  status: true,
  isActive: true,
  scheduledAt: true,
  publishedAt: true,
  viewCount: true,
  metaTitle: true,
  metaDescription: true,
  metaKeywords: true,
  ogImageUrl: true,
  createdAt: true,
  updatedAt: true,
  newsBrands: { select: { brand: { select: { id: true, name: true } } } },
  newsCarModels: { select: { model: { select: { id: true, name: true } } } },
} as const;

function shapeNews<
  T extends {
    newsBrands: { brand: { id: number; name: string } }[];
    newsCarModels: { model: { id: number; name: string } }[];
  },
>(news: T): Omit<T, 'newsBrands' | 'newsCarModels'> & NewsListItem {
  const { newsBrands, newsCarModels, ...rest } = news;
  return {
    ...rest,
    brands: newsBrands.map((ab) => ab.brand),
    models: newsCarModels.map((am) => am.model),
  } as Omit<T, 'newsBrands' | 'newsCarModels'> & NewsListItem;
}

async function assertSlugAvailable(slug: string, excludeId?: number) {
  const conflict = await prisma.news.findFirst({
    where: { slug, id: excludeId ? { not: excludeId } : undefined },
    select: { id: true },
  });
  if (conflict) {
    throw ApiError.conflict(`An news with the slug "${slug}" already exists`);
  }
}

async function assertCategoryExists(categoryId: number) {
  const category = await prisma.newsCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) throw ApiError.badRequest('Selected category does not exist');
}

async function assertAuthorExists(authorId: number) {
  const author = await prisma.adminUser.findUnique({ where: { id: authorId }, select: { id: true } });
  if (!author) throw ApiError.badRequest('Selected author does not exist');
}

async function assertBrandsExist(brandIds: number[]) {
  if (brandIds.length === 0) return;
  const count = await prisma.brand.count({ where: { id: { in: brandIds } } });
  if (count !== brandIds.length) {
    throw ApiError.badRequest('One or more selected brands do not exist');
  }
}

async function assertModelsExist(modelIds: number[]) {
  if (modelIds.length === 0) return;
  const count = await prisma.carModel.count({ where: { id: { in: modelIds } } });
  if (count !== modelIds.length) {
    throw ApiError.badRequest('One or more selected car models do not exist');
  }
}

function resolvePublishedAt(status: string, existingPublishedAt: Date | null): Date | null {
  if (status === 'published') {
    return existingPublishedAt ?? new Date();
  }
  return existingPublishedAt;
}

export async function listNews(query: NewsListQueryParsed) {
  const { page, limit, search, categoryId, brandId, modelId, status, isActive, sortBy, sortOrder } = query;

  const where: Prisma.NewsWhereInput = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(status ? { status } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(brandId ? { newsBrands: { some: { brandId } } } : {}),
    ...(modelId ? { newsCarModels: { some: { modelId } } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      select: NEWS_SELECT,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.news.count({ where }),
  ]);

  return {
    items: items.map(shapeNews),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getNewsById(id: number) {
  const news = await prisma.news.findUnique({ where: { id }, select: NEWS_SELECT });
  if (!news) {
    throw ApiError.notFound('News not found');
  }
  return shapeNews(news);
}

export async function createNews(
  input: CreateNewsParsed,
  actorId: number,
  coverImageFilename?: string,
  ipAddress?: string | null,
) {
  await assertCategoryExists(input.categoryId);
  await assertAuthorExists(input.authorId);
  await assertBrandsExist(input.brandIds);
  await assertModelsExist(input.modelIds);

  await assertSlugAvailable(input.slug);

  const publishedAt = resolvePublishedAt(input.status, null);

  const news = await prisma.$transaction(async (tx) => {
    const created = await tx.news.create({
      data: {
        categoryId: input.categoryId,
        authorId: input.authorId,
        createdBy: actorId,
        updatedBy: actorId,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt ?? null,
        body: input.body,
        coverImageUrl: coverImageFilename ? buildPublicPath('news', coverImageFilename) : null,
        readTimeMinutes: input.readTimeMinutes ?? null,
        status: input.status,
        isActive: input.isActive,
        scheduledAt: input.status === 'scheduled' ? input.scheduledAt : null,
        publishedAt,
        metaTitle: input.metaTitle ?? null,
        metaDescription: input.metaDescription ?? null,
        metaKeywords: input.metaKeywords ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
      },
      select: { id: true },
    });

    if (input.brandIds.length > 0) {
      await tx.newsBrand.createMany({
        data: input.brandIds.map((brandId) => ({ newsId: created.id, brandId })),
      });
    }
    if (input.modelIds.length > 0) {
      await tx.newsCarModel.createMany({
        data: input.modelIds.map((modelId) => ({ newsId: created.id, modelId })),
      });
    }

    return tx.news.findUniqueOrThrow({ where: { id: created.id }, select: NEWS_SELECT });
  });

  await createLog({
    adminId: actorId,
    description: `Created news "${news.title}" (id ${news.id}, slug "${news.slug}")`,
    ipAddress,
  });

  return shapeNews(news);
}

export async function updateNews(
  id: number,
  input: UpdateNewsParsed,
  actorId: number,
  coverImageFilename?: string,
  ipAddress?: string | null,
) {
  const existing = await getNewsById(id);

  await assertCategoryExists(input.categoryId);
  await assertAuthorExists(input.authorId);
  await assertBrandsExist(input.brandIds);
  await assertModelsExist(input.modelIds);

  if (input.slug !== existing.slug) {
    await assertSlugAvailable(input.slug, id);
  }

  const publishedAt = resolvePublishedAt(input.status, existing.publishedAt);
  // Computed up front, applied inside the same transaction as the rest
  // of the fields below — a new cover image (if one rode along) is no
  // longer a separate, non-atomic DB write that could succeed/fail
  // independently of the news's other edits.
  const newCoverImageUrl = coverImageFilename ? buildPublicPath('news', coverImageFilename) : undefined;

  const news = await prisma.$transaction(async (tx) => {
    await tx.news.update({
      where: { id },
      data: {
        categoryId: input.categoryId,
        authorId: input.authorId,
        updatedBy: actorId,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt ?? null,
        body: input.body,
        readTimeMinutes: input.readTimeMinutes ?? null,
        status: input.status,
        isActive: input.isActive,
        scheduledAt: input.status === 'scheduled' ? input.scheduledAt : null,
        publishedAt,
        metaTitle: input.metaTitle ?? null,
        metaDescription: input.metaDescription ?? null,
        metaKeywords: input.metaKeywords ?? null,
        ogImageUrl: input.ogImageUrl ?? null,
        ...(newCoverImageUrl ? { coverImageUrl: newCoverImageUrl } : {}),
      },
    });

    // Full-replace the brand/model links to match the submitted sets —
    // simplest way to keep this in sync with a multi-select form that
    // always submits the complete list.
    await tx.newsBrand.deleteMany({ where: { newsId: id } });
    if (input.brandIds.length > 0) {
      await tx.newsBrand.createMany({
        data: input.brandIds.map((brandId) => ({ newsId: id, brandId })),
      });
    }

    await tx.newsCarModel.deleteMany({ where: { newsId: id } });
    if (input.modelIds.length > 0) {
      await tx.newsCarModel.createMany({
        data: input.modelIds.map((modelId) => ({ newsId: id, modelId })),
      });
    }

    return tx.news.findUniqueOrThrow({ where: { id }, select: NEWS_SELECT });
  });

  // Old cover file is orphaned only once the transaction above has
  // committed successfully with the new one — clean it up after, same
  // order-of-operations as uploadNewsCoverImage below.
  if (newCoverImageUrl && existing.coverImageUrl) {
    await deleteUploadedFile(existing.coverImageUrl);
  }

  await createLog({
    adminId: actorId,
    description: `Updated news "${news.title}" (id ${news.id})`,
    ipAddress,
  });

  return shapeNews(news);
}

export async function updateNewsStatus(
  id: number,
  input: UpdateNewsStatusParsed,
  actorId: number,
  ipAddress?: string | null,
) {
  const existing = await getNewsById(id);
  const publishedAt = resolvePublishedAt(input.status, existing.publishedAt);

  const news = await prisma.news.update({
    where: { id },
    data: {
      status: input.status,
      scheduledAt: input.status === 'scheduled' ? input.scheduledAt : null,
      publishedAt,
      updatedBy: actorId,
    },
    select: NEWS_SELECT,
  });

  await createLog({
    adminId: actorId,
    description: `Changed status of news "${news.title}" (id ${id}) to "${input.status}"`,
    ipAddress,
  });

  return shapeNews(news);
}

export async function deleteNews(id: number, actorId: number, ipAddress?: string | null) {
  const news = await getNewsById(id);

  // News's FKs from news_brands/news_car_models/news_comments
  // are ON DELETE RESTRICT, so those rows must be cleared first or the
  // delete fails with a P2003 constraint error.
  await prisma.$transaction([
    prisma.newsBrand.deleteMany({ where: { newsId: id } }),
    prisma.newsCarModel.deleteMany({ where: { newsId: id } }),
    prisma.news.delete({ where: { id } }),
  ]);

  if (news.coverImageUrl) {
    await deleteUploadedFile(news.coverImageUrl);
  }

  await createLog({
    adminId: actorId,
    description: `Deleted news "${news.title}" (id ${id})`,
    ipAddress,
  });

  return { message: 'News deleted successfully' };
}

export async function uploadNewsCoverImage(
  id: number,
  savedFilename: string,
  actorId: number,
  ipAddress?: string | null,
): Promise<NewsUploadCoverResult> {
  const existing = await getNewsById(id);

  const newCoverImageUrl = buildPublicPath('news', savedFilename);

  const news = await prisma.news.update({
    where: { id },
    data: { coverImageUrl: newCoverImageUrl, updatedBy: actorId },
    select: { id: true, coverImageUrl: true },
  });

  if (existing.coverImageUrl) {
    await deleteUploadedFile(existing.coverImageUrl);
  }

  await createLog({
    adminId: actorId,
    description: `Updated cover image for news "${existing.title}" (id ${id})`,
    ipAddress,
  });

  return news as NewsUploadCoverResult;
}

export async function publishDueScheduledNews(): Promise<number> {
  const due = await prisma.news.findMany({
    where: { status: 'scheduled', scheduledAt: { lte: new Date() } },
    select: { id: true, title: true },
  });

  if (due.length === 0) return 0;

  await prisma.news.updateMany({
    where: { id: { in: due.map((a) => a.id) } },
    data: { status: 'published', publishedAt: new Date(), scheduledAt: null },
  });

  return due.length;
}