import { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { BookSellView } from "@/views/book-sale-form-view";

export const metadata: Metadata = {
  title: "판매글 작성",
  description: "중고 서적 판매글을 작성해보세요.",
};

type Props = {
  params: Promise<{ isbn: string }>;
};

export default async function Page({ params }: Props) {
  const { isbn } = await params;
  return (
    <AuthGuard>
      <BookSellView isbn={isbn} />
    </AuthGuard>
  );
}
