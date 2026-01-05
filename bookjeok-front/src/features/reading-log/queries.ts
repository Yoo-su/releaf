import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createReadingLog,
  deleteReadingLog,
  getReadingLogs,
  getReadingLogsInfinite,
  getReadingLogStats,
  updateReadingLog,
} from "./apis";
import { CreateReadingLogParams, UpdateReadingLogParams } from "./types";

export const readingLogKeys = {
  all: ["reading-logs"] as const,
  list: (year: number, month: number) =>
    [...readingLogKeys.all, "list", year, month] as const,
  stats: (year: number, month: number) =>
    [...readingLogKeys.all, "stats", year, month] as const,
  infinite: () => [...readingLogKeys.all, "infinite"] as const,
};

export const useReadingLogsQuery = (
  year: number,
  month: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: readingLogKeys.list(year, month),
    queryFn: () => getReadingLogs(year, month),
    enabled: options?.enabled,
  });
};

export const useReadingLogStatsQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: readingLogKeys.stats(year, month),
    queryFn: () => getReadingLogStats(year, month),
  });
};

export const useReadingLogsInfiniteQuery = () => {
  return useInfiniteQuery({
    queryKey: readingLogKeys.infinite(),
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
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};

export const useDeleteReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReadingLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};

export const useUpdateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateReadingLogParams) => updateReadingLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};
