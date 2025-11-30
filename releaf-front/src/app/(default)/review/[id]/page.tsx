import { Metadata } from "next";

import { ReviewDetailView } from "@/views/review-detail-view";

export const metadata: Metadata = {
  title: "리뷰",
  description: "도서 리뷰를 확인하세요.",
};

export default function ReviewDetailPage() {
  return <ReviewDetailView />;
}
