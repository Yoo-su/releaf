import { AuthGuard } from "@/features/auth/components/auth-guard";
import { BookSellView } from "@/views/book-sale-form-view";

export default function BookSellPage() {
  return (
    <AuthGuard>
      <BookSellView />
    </AuthGuard>
  );
}
