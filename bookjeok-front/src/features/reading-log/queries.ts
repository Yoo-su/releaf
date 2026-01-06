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

// 날짜 문자열에서 년/월 추출 헬퍼
const extractYearMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
};

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
    onSuccess: (data) => {
      const { year, month } = extractYearMonth(data.date);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.list(year, month).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.stats(year, month).queryKey,
      });
      // 리스트 뷰용 infinite 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.infinite.queryKey,
      });
    },
  });
};

export const useDeleteReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; date: string }) => deleteReadingLog(id),
    onSuccess: (_, variables) => {
      const { year, month } = extractYearMonth(variables.date);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.list(year, month).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.stats(year, month).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.infinite.queryKey,
      });
    },
  });
};

export const useUpdateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateReadingLogParams) => updateReadingLog(params),
    onSuccess: (data) => {
      const { year, month } = extractYearMonth(data.date);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.list(year, month).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.stats(year, month).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.readingLog.infinite.queryKey,
      });
    },
  });
};
