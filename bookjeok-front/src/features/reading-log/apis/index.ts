import { privateAxios } from "@/shared/libs/axios";

import { ReadingLog } from "../types";

export interface CreateReadingLogParams {
  bookIsbn: string;
  bookTitle: string;
  bookImage: string;
  bookAuthor: string;
  date: string; // YYYY-MM-DD 형식
  memo?: string;
}

export interface ReadingLogStats {
  monthlyCount: number;
  yearlyCount: number;
}

export interface ReadingLogListResponse {
  items: ReadingLog[];
  nextCursor: string | null;
}

export const getReadingLogs = async (year: number, month: number) => {
  const response = await privateAxios.get<ReadingLog[]>(`/reading-logs`, {
    params: { year, month },
  });
  return response.data;
};

export const getReadingLogStats = async (year: number, month: number) => {
  const response = await privateAxios.get<ReadingLogStats>(
    `/reading-logs/stats`,
    {
      params: { year, month },
    }
  );
  return response.data;
};

export const getReadingLogsInfinite = async ({
  pageParam,
  limit = 10,
}: {
  pageParam?: string | null;
  limit?: number;
}) => {
  const response = await privateAxios.get<ReadingLogListResponse>(
    `/reading-logs/list`,
    {
      params: { cursorId: pageParam, limit },
    }
  );
  return response.data;
};

export const createReadingLog = async (params: CreateReadingLogParams) => {
  const response = await privateAxios.post<ReadingLog>(`/reading-logs`, params);
  return response.data;
};

export interface UpdateReadingLogParams {
  id: string;
  memo: string;
}

export const updateReadingLog = async (params: UpdateReadingLogParams) => {
  const response = await privateAxios.patch<ReadingLog>(
    `/reading-logs/${params.id}`,
    { memo: params.memo }
  );
  return response.data;
};

export const deleteReadingLog = async (id: string) => {
  const response = await privateAxios.delete(`/reading-logs/${id}`);
  return response.data;
};
