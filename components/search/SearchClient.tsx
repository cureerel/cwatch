import { Suspense } from "react";
import { SearchContent } from "./SearchContent";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";

export function SearchClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-12">
          <div className="text-center mb-8 sm:mb-10">
            <div className="h-12 w-48 bg-muted rounded-lg mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-14 bg-muted rounded-2xl animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}