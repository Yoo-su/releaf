"use client";

import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ReviewCard } from "@/features/review/components/review-card";
import { useReviewsQuery } from "@/features/review/queries";
import { Button } from "@/shared/components/shadcn/button";
import { PATHS } from "@/shared/constants/paths";

import { RecommendReviewsSkeleton } from "./skeleton";

interface RecommendReviewsProps {
  id: number;
  category: string;
}

/**
 * 리뷰 상세페이지 추천 리뷰(같은 카테고리) 섹션
 */
export const RecommendReviews = ({ id, category }: RecommendReviewsProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  const { data, isLoading, isError } = useReviewsQuery({
    category,
    excludeId: id,
    limit: 4,
    enabled: inView,
  });

  const reviews = data?.reviews;

  if (isLoading) {
    return <RecommendReviewsSkeleton />;
  }

  if (isError) {
    return (
      <section
        ref={ref}
        className="w-full py-12 border-t border-stone-100 mt-12"
      >
        <div className="text-center text-red-500 py-8">
          추천 글을 불러오는 데 실패했습니다.
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section
        ref={ref}
        className="w-full py-12 border-t border-stone-100 mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              이런 '{category}' 리뷰는 어떠세요?
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              같은 카테고리의 최신 글을 추천해드려요
            </p>
          </div>
        </div>
        <div className="text-center py-12 bg-stone-50 rounded-xl text-stone-500">
          아직 추천할 만한 다른 리뷰가 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="w-full py-12 border-t border-stone-100 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800">
            이런 '{category}' 리뷰는 어떠세요?
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            같은 카테고리의 최신 글을 추천해드려요
          </p>
        </div>

        <Link href={`${PATHS.REVIEWS}?category=${category}`}>
          <Button variant="ghost" size="sm" className="text-stone-500">
            더보기
          </Button>
        </Link>
      </div>

      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={16}
        className="w-full overflow-visible! [clip-path:inset(-100px_-10px)]"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={review.id} className="w-[280px]! sm:w-[320px]!">
            <ReviewCard review={review} priority={index < 2} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
