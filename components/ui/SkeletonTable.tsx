import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable() {
  return (
    <div className="flex w-full p-2 md:p-4 flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      ))}
    </div>
  );
}
