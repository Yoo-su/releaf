export interface ReadingLog {
  id: string;
  userId: number;
  bookIsbn: string;
  bookTitle: string;
  bookImage: string;
  bookAuthor: string;
  date: string; // YYYY-MM-DD 형식
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
