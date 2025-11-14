import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "card" | "weather" | "forecast" | "sidebar";
  className?: string;
}

export const LoadingSkeleton = ({ type = "card", className = "" }: LoadingSkeletonProps) => {
  if (type === "weather") {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Main weather card skeleton */}
        <div className="glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
          <div className="animate-pulse">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div>
                <Skeleton className="h-12 w-48 mb-4" />
                <Skeleton className="h-4 w-64 mb-6" />
              </div>
              <div className="lg:text-right">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-16 w-32 mb-4" />
                <div className="flex flex-wrap lg:justify-end gap-4 lg:gap-6">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 lg:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-6 w-8 mb-2 mx-auto" />
                  <Skeleton className="h-3 w-6 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast skeleton */}
        <div className="glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-3 w-12 mb-3 mx-auto" />
                <Skeleton className="h-6 w-8 mb-2 mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "forecast") {
    return (
      <div className={`glass-dark rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 ${className}`}>
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="text-center animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
              <Skeleton className="h-3 w-12 mb-3 mx-auto" />
              <Skeleton className="h-6 w-8 mb-2 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl p-4 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className={`glass rounded-3xl p-6 animate-pulse ${className}`}>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};
