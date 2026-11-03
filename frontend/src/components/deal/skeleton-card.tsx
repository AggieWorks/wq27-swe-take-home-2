"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SkeletonCard({
  showBorder,
  isInCarousel,
}: {
  showBorder?: boolean;
  isInCarousel?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full min-w-[200px] cursor-pointer select-none sm:min-h-[18rem]",
        "sm:w-full", // Ensures each card takes the full width of its grid column
        showBorder && "border-1 border-b border-[#d8d8d8] sm:border-0 sm:pb-0",
        isInCarousel
          ? "h-[20.5rem]"
          : "flex items-center gap-[0.875rem] py-5 sm:block"
      )}
    >
      
      <div className={cn(
        "relative size-[5.125rem] sm:h-[11.75rem] sm:w-full",
        isInCarousel && "h-[11.75rem] w-full"
      )}>
        <Skeleton className="h-full w-full rounded-lg object-cover" />
      </div>
      <div className={cn(
        "absolute left-[6rem] top-[1.5rem] flex max-w-screen-xs flex-col gap-[0.9rem] sm:relative sm:left-0 sm:gap-2",
        isInCarousel && "relative left-0 gap-2"
      )}>
        <Skeleton className="h-5 max-w-[250px]" />
        <Skeleton className="h-3 w-[150px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  );
}
