// src/pages/News/News/news.api.ts
//
// RTK Query version, same pattern as brand.api.ts (FormData upload) +
// offer.api.ts (status field).

import { api } from "../../../store/baseApi";

export type NewsStatus = "draft" | "scheduled" | "published";

export interface NewsTagRef {
  id: number;
  name: string;
}

export interface NewsRecord {
  id: number;
  categoryId: number;
  category: { id: number; name: string; slug: string };
  authorId: number;
  author: { id: number; name: string };
  createdBy: number | null;
  createdByAdmin: { id: number; name: string } | null;
  updatedBy: number | null;
  updatedByAdmin: { id: number; name: string } | null;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverImageUrl: string | null;
  readTimeMinutes: number | null;
  status: NewsStatus;
  isActive: boolean;
  scheduledAt: string | null;
  publishedAt: string | null;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  brands: NewsTagRef[];
  models: NewsTagRef[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListNewsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
  modelId?: number;
  status?: NewsStatus;
  isActive?: boolean;
  sortBy?: "id" | "title" | "createdAt" | "publishedAt" | "viewCount";
  sortOrder?: "asc" | "desc";
}

// Shared shape for both create and update — the editor always submits
// the complete form (full-replace), same convention as offer/brand.
export interface NewsFormInput {
  categoryId: number;
  authorId: number;
  title: string;
  slug?: string;
  excerpt?: string | null;
  body: string;
  readTimeMinutes?: number | null;
  status: NewsStatus;
  isActive: boolean;
  scheduledAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  // Open Graph image URL (social-share preview) — plain URL, not an
  // upload, separate from coverImage below.
  ogImageUrl?: string | null;
  brandIds: number[];
  modelIds: number[];
  // Optional — a draft can be saved without a cover image and have one
  // added later.
  coverImage?: File;
}

interface NewsListRawResponse {
  success: true;
  data: NewsRecord[];
  pagination: Pagination;
}

interface NewsSingleRawResponse {
  success: true;
  data: NewsRecord;
}

export interface NewsListResult {
  data: NewsRecord[];
  pagination: Pagination;
}

const NEWS_LIST_TAG = { type: "News" as const, id: "LIST" };

function buildFormData(input: NewsFormInput): FormData {
  const formData = new FormData();
  formData.append("categoryId", String(input.categoryId));
  formData.append("authorId", String(input.authorId));
  formData.append("title", input.title);
  if (input.slug) formData.append("slug", input.slug);
  if (input.excerpt) formData.append("excerpt", input.excerpt);
  formData.append("body", input.body);
  if (input.readTimeMinutes != null) formData.append("readTimeMinutes", String(input.readTimeMinutes));
  formData.append("status", input.status);
  formData.append("isActive", String(input.isActive));
  if (input.scheduledAt) formData.append("scheduledAt", input.scheduledAt);
  if (input.metaTitle) formData.append("metaTitle", input.metaTitle);
  if (input.metaDescription) formData.append("metaDescription", input.metaDescription);
  if (input.metaKeywords) formData.append("metaKeywords", input.metaKeywords);
  if (input.ogImageUrl) formData.append("ogImageUrl", input.ogImageUrl);
  formData.append("brandIds", JSON.stringify(input.brandIds));
  formData.append("modelIds", JSON.stringify(input.modelIds));
  if (input.coverImage) formData.append("coverImage", input.coverImage);
  return formData;
}

export const newsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<NewsListResult, ListNewsParams | void>({
      query: (params) => ({ url: "/news", method: "GET", params: params ?? {} }),
      transformResponse: (res: NewsListRawResponse) => ({ data: res.data, pagination: res.pagination }),
      providesTags: (result) =>
        result
          ? [...result.data.map((a) => ({ type: "News" as const, id: a.id })), NEWS_LIST_TAG]
          : [NEWS_LIST_TAG],
    }),

    getNewsById: builder.query<NewsRecord, number>({
      query: (id) => ({ url: `/news/${id}`, method: "GET" }),
      transformResponse: (res: NewsSingleRawResponse) => res.data,
      providesTags: (_result, _error, id) => [{ type: "News", id }],
    }),

    createNews: builder.mutation<NewsRecord, NewsFormInput>({
      query: (input) => ({ url: "/news", method: "POST", data: buildFormData(input) }),
      transformResponse: (res: NewsSingleRawResponse) => res.data,
      invalidatesTags: [NEWS_LIST_TAG],
    }),

    updateNews: builder.mutation<NewsRecord, { id: number; input: NewsFormInput }>({
      query: ({ id, input }) => ({ url: `/news/${id}`, method: "PATCH", data: buildFormData(input) }),
      transformResponse: (res: NewsSingleRawResponse) => res.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "News", id }, NEWS_LIST_TAG],
    }),

    // Lightweight row-level status change — separate from the full edit
    // mutation, same reasoning as brand.api.ts's updateBrandStatus.
    updateNewsStatus: builder.mutation<
      NewsRecord,
      { id: number; status: NewsStatus; scheduledAt?: string | null }
    >({
      query: ({ id, status, scheduledAt }) => ({
        url: `/news/${id}/status`,
        method: "PATCH",
        data: { status, scheduledAt },
      }),
      transformResponse: (res: NewsSingleRawResponse) => res.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "News", id }, NEWS_LIST_TAG],
    }),

    deleteNews: builder.mutation<void, number>({
      query: (id) => ({ url: `/news/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "News", id }, NEWS_LIST_TAG],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useUpdateNewsStatusMutation,
  useDeleteNewsMutation,
} = newsApi;