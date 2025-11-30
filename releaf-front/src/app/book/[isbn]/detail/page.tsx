import { Metadata } from "next";

import { BookDetailView } from "@/views/book-detail-view";

export const metadata: Metadata = {
  title: "도서 상세",
  description: "도서 상세 정보를 확인하세요.",
};

type Props = {
  params: Promise<{ isbn: string }>;
};

export default async function Page({ params }: Props) {
  const { isbn } = await params;

  return <BookDetailView isbn={isbn} />;
}
