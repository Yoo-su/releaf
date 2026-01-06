import { ReadingLogCalendar } from "@/features/reading-log/components/reading-log-calendar";
import { ReadingLogHeader } from "@/features/reading-log/components/reading-log-header";

export function ReadingLogView() {
  return (
    <div className="container py-8 md:py-12 space-y-8">
      <ReadingLogHeader />
      <ReadingLogCalendar />
    </div>
  );
}
