// src/modules/news/newsCategory/newsCategory.service.ts

import { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/client';
import { ApiError } from '@/core/errors/ApiError';
import { createLog } from '@/core/utils/createLog';
import type {
  NewsCategoryListQueryParsed,
  CreateNewsCategoryParsed,
  UpdateNewsCategoryParsed,
} from './newsCategory.validation';

const NEWS_CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdByAdmin: { select: { id: true, name: true } },
  updatedByAdmin: { select: { id: true, name: true } },
  _count: { select: { news: true } },
} as const;

function shapeCategory<T extends { _count: { news: number } }>(category: T) {
  const { _count, ...rest } = category;
  return { ...rest, newsCount: _count.news };
}

async function assertSlugAvailable(slug: string, excludeId?: number) {
  const conflict = await prisma.newsCategory.findFirst({
    where: { slug, id: excludeId ? { not: excludeId } : undefined },
    select: { id: true },
  });
  if (conflict) {
    throw ApiError.conflict(`An news category with the slug "${slug}" already exists`);
  }
}

export async function listNewsCategories(query: NewsCategoryListQueryParsed) {
  const { page, limit, search, isActive, sortBy, sortOrder } = query;

  const where: Prisma.NewsCategoryWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(isActive !== undefined ? { isActive } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.newsCategory.findMany({
      where,
      select: NEWS_CATEGORY_SELECT,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.newsCategory.count({ where }),
  ]);

  return {
    items: items.map(shapeCategory),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getNewsCategoryById(id: number) {
  const category = await prisma.newsCategory.findUnique({
    where: { id },
    select: NEWS_CATEGORY_SELECT,
  });

  if (!category) {
    throw ApiError.notFound('News category not found');
  }

  return shapeCategory(category);
}

export async function createNewsCategory(
  input: CreateNewsCategoryParsed,
  actorId: number,
  ipAddress?: string | null,
) {
  await assertSlugAvailable(input.slug);

  const category = await prisma.newsCategory.create({
    data: {
      name: input.name,
      slug: input.slug,
      isActive: input.isActive,
      createdBy: actorId,
      updatedBy: actorId,
    },
    select: NEWS_CATEGORY_SELECT,
  });

  await createLog({
    adminId: actorId,
    description: `Created news category "${category.name}" (id ${category.id}, slug "${category.slug}")`,
    ipAddress,
  });

  return shapeCategory(category);
}

export async function updateNewsCategory(
  id: number,
  input: UpdateNewsCategoryParsed,
  actorId: number,
  ipAddress?: string | null,
) {
  const existing = await getNewsCategoryById(id);

  if (input.slug !== existing.slug) {
    await assertSlugAvailable(input.slug, id);
  }

  const category = await prisma.newsCategory.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      isActive: input.isActive,
      updatedBy: actorId,
    },
    select: NEWS_CATEGORY_SELECT,
  });

  await createLog({
    adminId: actorId,
    description: `Updated news category "${category.name}" (id ${category.id})`,
    ipAddress,
  });

  return shapeCategory(category);
}

export async function updateNewsCategoryStatus(
  id: number,
  isActive: boolean,
  actorId: number,
  ipAddress?: string | null,
) {
  const existing = await getNewsCategoryById(id);

  const category = await prisma.newsCategory.update({
    where: { id },
    data: { isActive, updatedBy: actorId },
    select: NEWS_CATEGORY_SELECT,
  });

  await createLog({
    adminId: actorId,
    description: `${isActive ? 'Activated' : 'Deactivated'} news category "${existing.name}" (id ${id})`,
    ipAddress,
  });

  return shapeCategory(category);
}

export async function deleteNewsCategory(id: number, actorId: number, ipAddress?: string | null) {
  const category = await getNewsCategoryById(id);

  const newsCount = await prisma.news.count({ where: { categoryId: id } });
  if (newsCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete this category — ${newsCount} news(s) are linked to it. Delete or reassign them first.`,
    );
  }

  await prisma.newsCategory.delete({ where: { id } });

  await createLog({
    adminId: actorId,
    description: `Deleted news category "${category.name}" (id ${id})`,
    ipAddress,
  });

  return { message: 'News category deleted successfully' };
}