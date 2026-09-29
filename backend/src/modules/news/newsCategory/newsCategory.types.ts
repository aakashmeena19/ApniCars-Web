// src/modules/news/newsCategory/newsCategory.types.ts

export interface NewsCategoryListItem {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByAdmin: { id: number; name: string } | null;
  updatedByAdmin: { id: number; name: string } | null;
  newsCount: number;
}