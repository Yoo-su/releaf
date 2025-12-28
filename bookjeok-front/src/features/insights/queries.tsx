import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/shared/constants/query-keys";

import { getInsights, getLocationSales } from "./apis";

/**
 * 서비스 인사이트 데이터를 조회하는 React Query 훅
 */
export const useInsightsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.insightsKeys.all.queryKey,
    queryFn: getInsights,
    staleTime: 1000 * 60 * 30, // 30분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
  });
};

/**
 * 특정 지역의 판매글을 조회하는 React Query 훅
 */
export const useLocationSalesQuery = (city: string, district: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.insightsKeys.locationSales(city, district).queryKey,
    queryFn: () => getLocationSales(city, district),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
    enabled: !!city && !!district,
  });
};
