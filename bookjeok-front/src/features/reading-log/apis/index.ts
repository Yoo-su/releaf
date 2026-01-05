import { API_PATHS } from "@/shared/constants/apis";
import { privateAxios } from "@/shared/libs/axios";

import {
  CreateReadingLogParams,
  ReadingLog,
  ReadingLogListResponse,
  ReadingLogStats,
  UpdateReadingLogParams,
} from "../types";

export const getReadingLogs = async (year: number, month: number) => {
  const response = await privateAxios.get<ReadingLog[]>(
    API_PATHS.readingLog.base,
    {
      params: { year, month },
    }
  );
  return response.data;
};

export const getReadingLogStats = async (year: number, month: number) => {
  const response = await privateAxios.get<ReadingLogStats>(
    API_PATHS.readingLog.stats,
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
    API_PATHS.readingLog.list,
    {
      params: { cursorId: pageParam, limit },
    }
  );
  return response.data;
};

export const createReadingLog = async (params: CreateReadingLogParams) => {
  const response = await privateAxios.post<ReadingLog>(
    API_PATHS.readingLog.base,
    params
  );
  return response.data;
};

export const updateReadingLog = async (params: UpdateReadingLogParams) => {
  const response = await privateAxios.patch<ReadingLog>(
    API_PATHS.readingLog.detail(params.id),
    { memo: params.memo }
  );
  return response.data;
};

export const deleteReadingLog = async (id: string) => {
  const response = await privateAxios.delete(API_PATHS.readingLog.detail(id));
  return response.data;
};
