// src/pages/News/NewsCategories/newsCategory.api.ts
//
// RTK Query version, same pattern as bodyType.api.ts / country.api.ts.

import { api } from "../../../store/baseApi";

export interface NewsCategoryRecord {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdByAdmin: { id: number; name: string } | null;
  updatedByAdmin: { id: number; name: string } | null;
  // Shown in the list so it's obvious *why* delete might be blocked
  // before the admin even tries — mirrors the backend's protective
  // check (see newsCategory.service.ts's deleteNewsCategory).
  newsCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListNewsCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "id" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateNewsCategoryInput {
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface UpdateNewsCategoryInput {
  name: string;
  slug?: string;
  isActive: boolean;
}

interface NewsCategoryListRawResponse {
  success: true;
  data: NewsCategoryRecord[];
  pagination: Pagination;
}

interface NewsCategorySingleRawResponse {
  success: true;
  data: NewsCategoryRecord;
}

export interface NewsCategoryListResult {
  data: NewsCategoryRecord[];
  pagination: Pagination;
}

const NEWS_CATEGORY_LIST_TAG = { type: "NewsCategory" as const, id: "LIST" };

export const newsCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNewsCategories: builder.query<NewsCategoryListResult, ListNewsCategoriesParams | void>({
      query: (params) => ({ url: "/news/categories", method: "GET", params: params ?? {} }),
      transformResponse: (res: NewsCategoryListRawResponse) => ({
        data: res.data,
        pagination: res.pagination,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((c) => ({ type: "NewsCategory" as const, id: c.id })),
              NEWS_CATEGORY_LIST_TAG,
            ]
          : [NEWS_CATEGORY_LIST_TAG],
    }),

    getNewsCategoryById: builder.query<NewsCategoryRecord, number>({
      query: (id) => ({ url: `/news/categories/${id}`, method: "GET" }),
      transformResponse: (res: NewsCategorySingleRawResponse) => res.data,
      providesTags: (_result, _error, id) => [{ type: "NewsCategory", id }],
    }),

    createNewsCategory: builder.mutation<NewsCategoryRecord, CreateNewsCategoryInput>({
      query: (input) => ({ url: "/news/categories", method: "POST", data: input }),
      transformResponse: (res: NewsCategorySingleRawResponse) => res.data,
      invalidatesTags: [NEWS_CATEGORY_LIST_TAG],
    }),

    updateNewsCategory: builder.mutation<
      NewsCategoryRecord,
      { id: number; input: UpdateNewsCategoryInput }
    >({
      query: ({ id, input }) => ({ url: `/news/categories/${id}`, method: "PATCH", data: input }),
      transformResponse: (res: NewsCategorySingleRawResponse) => res.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "NewsCategory", id }, NEWS_CATEGORY_LIST_TAG],
    }),

    // Lightweight row-level status change — separate from the full edit
    // mutation, same reasoning as brand.api.ts's updateBrandStatus.
    updateNewsCategoryStatus: builder.mutation<NewsCategoryRecord, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/news/categories/${id}/status`,
        method: "PATCH",
        data: { isActive },
      }),
      transformResponse: (res: NewsCategorySingleRawResponse) => res.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "NewsCategory", id }, NEWS_CATEGORY_LIST_TAG],
    }),

    deleteNewsCategory: builder.mutation<void, number>({
      query: (id) => ({ url: `/news/categories/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "NewsCategory", id }, NEWS_CATEGORY_LIST_TAG],
    }),
  }),
});

export const {
  useGetNewsCategoriesQuery,
  useGetNewsCategoryByIdQuery,
  useCreateNewsCategoryMutation,
  useUpdateNewsCategoryMutation,
  useUpdateNewsCategoryStatusMutation,
  useDeleteNewsCategoryMutation,
} = newsCategoryApi;