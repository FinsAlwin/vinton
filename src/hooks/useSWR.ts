"use client";

import useSWR, { SWRConfiguration } from "swr";
import type { ApiResponse, Content, Media, ContentFilters } from "@/types";

const fetcher = async <T = unknown>(url: string): Promise<T> => {
  // First attempt
  let res = await fetch(url);

  // If unauthorized, try refresh flow once
  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
    if (refreshRes.ok) {
      res = await fetch(url);
    }
  }

  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    const error = new Error(
      "An error occurred while fetching the data."
    ) as Error & {
      info?: unknown;
      status?: number;
    };
    error.info = info;
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
};

export function useContent(
  type: string,
  filters?: ContentFilters,
  config?: SWRConfiguration
) {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  const url = `/api/content/${type}?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Content[]>>(
    url,
    () => fetcher<ApiResponse<Content[]>>(url),
    { ...defaultConfig, ...config }
  );

  return {
    content: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useContentItem(
  type: string,
  id: string | null,
  config?: SWRConfiguration
) {
  const url = id ? `/api/content/${type}/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Content>>(
    url,
    url ? () => fetcher<ApiResponse<Content>>(url) : null,
    { ...defaultConfig, ...config }
  );

  return {
    content: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useContentBySlug(
  type: string,
  slug: string | null,
  config?: SWRConfiguration
) {
  const url = slug ? `/api/content/${type}/slug/${slug}` : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Content>>(
    url,
    url ? () => fetcher<ApiResponse<Content>>(url) : null,
    { ...defaultConfig, ...config }
  );

  return {
    content: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMedia(
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
    mimeType?: string;
  },
  config?: SWRConfiguration
) {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.mimeType) params.append("mimeType", filters.mimeType);

  const url = `/api/media?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Media[]>>(
    url,
    () => fetcher<ApiResponse<Media[]>>(url),
    { ...defaultConfig, ...config }
  );

  return {
    media: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMediaItem(id: string | null, config?: SWRConfiguration) {
  const url = id ? `/api/media/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Media>>(
    url,
    url ? () => fetcher<ApiResponse<Media>>(url) : null,
    { ...defaultConfig, ...config }
  );

  return {
    media: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}
