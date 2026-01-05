"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/shadcn/button";

import { useReadingLogsQuery } from "../queries";
import { DayDetailsDialog } from "./day-details-dialog";
import { ReadingLogDayCell } from "./reading-log-day-cell";

export function ReadingLogCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // API 호출
  const { data: logs = [] } = useReadingLogsQuery(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const getLogsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return logs.filter((log) => log.date === dateStr);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, "yyyy년 M월", { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="hover:bg-teal-50 hover:text-teal-600 border-gray-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="hover:bg-teal-50 hover:text-teal-600 border-gray-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {weekDayNames.map((day, i) => (
            <div
              key={day}
              className={`py-3 text-center text-sm font-semibold ${
                i === 0
                  ? "text-rose-500"
                  : i === 6
                    ? "text-blue-500"
                    : "text-gray-500"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 캘린더 그리드 */}
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] divide-x divide-y divide-gray-100">
          {calendarDays.map((day) => (
            <ReadingLogDayCell
              key={day.toISOString()}
              date={day}
              logs={getLogsForDate(day)}
              isCurrentMonth={isSameMonth(day, monthStart)}
              onClick={() => handleDayClick(day)}
            />
          ))}
        </div>
      </div>

      <DayDetailsDialog
        date={selectedDate}
        logs={selectedDate ? getLogsForDate(selectedDate) : []}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
