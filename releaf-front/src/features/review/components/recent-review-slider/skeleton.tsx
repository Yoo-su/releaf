import { Skeleton } from "@/shared/components/shadcn/skeleton";

export const RecentReviewSliderSkeleton = () => {
  return (
    <div className="w-full overflow-hidden px-4">
      <div className="flex gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-[320px] h-[180px] rounded-xl border border-stone-100 bg-white overflow-hidden"
          >
            <div className="flex h-full">
              <div className="w-[120px] shrink-0 bg-stone-100">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex-1 p-3 flex flex-col gap-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-5 w-3/4 mt-2" />
                <Skeleton className="h-5 w-1/2" />
                <div className="mt-auto flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
