import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

import { getBookList, getRecentBookSales } from "@/features/book/apis";
import { MAIN_PUBLISHERS } from "@/features/book/constants";
import { getReviews } from "@/features/review/apis";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { getQueryClient } from "@/shared/libs/query-client";
import { MainView } from "@/views/main-view";

export const metadata: Metadata = {
  title: "홈",
  description:
    "bookjeok의 홈 페이지입니다. 지금 가장 인기있는 중고 서적과 솔직한 도서 리뷰를 확인해보세요.",
};

export default async function Page() {
  const queryClient = getQueryClient();

  // 5개 출판사별 책 목록 prefetch (display=10)
  const publisherPrefetches = MAIN_PUBLISHERS.map((publisher) =>
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.bookKeys.list({ query: publisher, display: 10 })
        .queryKey,
      queryFn: async () => {
        const result = await getBookList({ query: publisher, display: 10 });
        if (!result.success) return [];
        return result.items;
      },
    })
  );

  await Promise.all([
    // 출판사별 책 목록 prefetch
    ...publisherPrefetches,
    // 최근 판매글 prefetch
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.bookKeys.recentSales.queryKey,
      queryFn: getRecentBookSales,
    }),
    // 최신 리뷰 prefetch (page: 1, limit: 10)
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.reviewKeys.list({ page: 1, limit: 10 }).queryKey,
      queryFn: () => getReviews({ page: 1, limit: 10 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainView />
    </HydrationBoundary>
  );
}
