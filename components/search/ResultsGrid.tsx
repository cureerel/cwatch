import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";
import type { Movie } from "@/types";

interface ResultsGridProps {
  loading?: boolean;
  movies: Movie[];
}

export function ResultsGrid({ loading = false, movies }: ResultsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {movies.map((movie) => (
        <MovieCard
          key={`${movie.id}-${movie.media_type}`}
          movie={movie}
          mediaType={movie.media_type ?? "movie"}
        />
      ))}
    </div>
  );
}