"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/components/shadcn/button";
import { Skeleton } from "@/shared/components/shadcn/skeleton";

export function ReadingLogCalendarSkeleton() {
  const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled className="opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" disabled className="opacity-50">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {weekDayNames.map((day, i) => (
            <div
              key={day}
              className={`py-3 text-center text-sm font-semibold ${
                i === 0
                  ? "text-rose-500/50"
                  : i === 6
                    ? "text-blue-500/50"
                    : "text-gray-500/50"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] divide-x divide-y divide-gray-100">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="p-2 flex flex-col gap-2 h-full">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
