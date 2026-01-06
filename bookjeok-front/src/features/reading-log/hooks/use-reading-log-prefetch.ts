import { useQueryClient } from "@tanstack/react-query";
import { addMonths, subMonths } from "date-fns";
import { useEffect } from "react";

import { QUERY_KEYS } from "@/shared/constants/query-keys";

import { getReadingLogs, getReadingLogStats } from "../apis";

export const useReadingLogPrefetch = (year: number, month: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentDate = new Date(year, month - 1);
    const prevDate = subMonths(currentDate, 1);
    const nextDate = addMonths(currentDate, 1);

    const targetDates = [prevDate, nextDate];

    targetDates.forEach((date) => {
      const targetYear = date.getFullYear();
      const targetMonth = date.getMonth() + 1;

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.readingLog.list(targetYear, targetMonth).queryKey,
        queryFn: () => getReadingLogs(targetYear, targetMonth),
        staleTime: 1000 * 60 * 5,
      });

      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.readingLog.stats(targetYear, targetMonth).queryKey,
        queryFn: () => getReadingLogStats(targetYear, targetMonth),
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [year, month, queryClient]);
};
