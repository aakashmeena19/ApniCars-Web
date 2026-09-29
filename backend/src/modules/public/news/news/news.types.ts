// src/modules/public/news/news/news.types.ts
//
// Public-safe full-news shape — no status/isActive/scheduledAt/
// createdBy/updatedBy/viewCount, only what the news detail page
// renders (content + SEO meta).

export interface PublicNewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface PublicNewsDetail {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverImageUrl: string | null;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string };
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageUrl: string | null;
}
