import useSWR from "swr";
import type { ActivityLog, LogFilters, ApiResponse } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseLogsOptions extends LogFilters {}

export function useLogs(options: UseLogsOptions = {}) {
  const {
    page = 1,
    limit = 50,
    search = "",
    action = "",
    resource = "",
    startDate = "",
    endDate = "",
  } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(action && { action }),
    ...(resource && { resource }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ActivityLog[]>>(
    `/api/logs?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    logs: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    mutate,
  };
}

// Hook for dashboard widget - fetches only recent logs
export function useRecentLogs(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ActivityLog[]>>(
    `/api/logs?page=1&limit=${limit}`,
    fetcher,
    {
      refreshInterval: 30000, // Auto-refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    logs: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}
