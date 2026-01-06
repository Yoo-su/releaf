import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys";

import {
  createReadingLog,
  deleteReadingLog,
  getReadingLogs,
  getReadingLogsInfinite,
  getReadingLogStats,
  updateReadingLog,
} from "./apis";
import { CreateReadingLogParams, UpdateReadingLogParams } from "./types";

export const useReadingLogsQuery = (
  year: number,
  month: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: QUERY_KEYS.readingLog.list(year, month).queryKey,
    queryFn: () => getReadingLogs(year, month),
    enabled: options?.enabled,
  });
};

export const useReadingLogStatsQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.readingLog.stats(year, month).queryKey,
    queryFn: () => getReadingLogStats(year, month),
  });
};

export const useReadingLogsInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.readingLog.infinite.queryKey,
    queryFn: getReadingLogsInfinite,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useCreateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReadingLogParams) => createReadingLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.all.queryKey,
      });
    },
  });
};

export const useDeleteReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReadingLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.all.queryKey,
      });
    },
  });
};

export const useUpdateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateReadingLogParams) => updateReadingLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.all.queryKey,
      });
    },
  });
};
