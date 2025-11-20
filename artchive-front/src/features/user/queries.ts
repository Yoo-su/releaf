"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { privateAxios } from "@/shared/libs/axios";

export interface UserStats {
  salesCount: number;
  salesStatusCounts: {
    ON_SALE?: number;
    RESERVED?: number;
    SOLD_OUT?: number;
    WITHDRAWN?: number;
  };
  chatRoomCount: number;
}

export const useMyStatsQuery = () => {
  return useQuery<UserStats>({
    queryKey: QUERY_KEYS.userKeys.stats.queryKey,
    queryFn: async () => {
      const response = await privateAxios.get<{
        success: boolean;
        stats: UserStats;
      }>("/user/stats");
      return response.data.stats;
    },
  });
};
