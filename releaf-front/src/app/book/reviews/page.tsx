import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

import { getPopularReviews } from "@/features/review/apis";
import { QUERY_KEYS } from "@/shared/constants/query-keys";
import { getQueryClient } from "@/shared/libs/query-client";
import { ReviewHomeView } from "@/views/review-home-view";

export const metadata: Metadata = {
  title: "리뷰 홈",
  description: "다양한 책에 대한 솔직한 리뷰를 만나보세요.",
};

export default async function Page() {
  const queryClient = getQueryClient();

  // 인기 리뷰 prefetch
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.reviewKeys.popular.queryKey,
    queryFn: getPopularReviews,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewHomeView />
    </HydrationBoundary>
  );
}
