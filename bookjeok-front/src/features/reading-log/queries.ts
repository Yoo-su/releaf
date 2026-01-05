import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createReadingLog,
  deleteReadingLog,
  getReadingLogs,
  updateReadingLog,
} from "./apis";
import { CreateReadingLogParams, UpdateReadingLogParams } from "./apis";

export const readingLogKeys = {
  all: ["reading-logs"] as const,
  list: (year: number, month: number) =>
    [...readingLogKeys.all, "list", year, month] as const,
};

export const useReadingLogsQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: readingLogKeys.list(year, month),
    queryFn: () => getReadingLogs(year, month),
  });
};

export const useCreateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateReadingLogParams) => createReadingLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};

export const useDeleteReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReadingLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};

export const useUpdateReadingLogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateReadingLogParams) => updateReadingLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: readingLogKeys.all });
    },
  });
};
