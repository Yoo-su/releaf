import { Metadata } from "next";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { BookSaleDetailView } from "@/views/book-sale-detail-view";

export const metadata: Metadata = {
  title: "판매글 상세",
  description: "중고 서적 판매글입니다.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <AuthGuard>
      <BookSaleDetailView saleId={id} />
    </AuthGuard>
  );
}
