// src/modules/public/home/news/news.types.ts
//
// Public-safe shape — no draft/scheduled fields, no createdBy/updatedBy
// audit trail, no SEO meta. Only what the website's News section
// needs to render a card.

export interface PublicHomeNewsRecord {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  category: { id: number; name: string; slug: string };
  author: { id: number; name: string };
}
