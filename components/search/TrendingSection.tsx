import { TrendingUp } from "lucide-react";
import { ResultsGrid } from "./ResultsGrid";
import type { Movie } from "@/types";

interface TrendingSectionProps {
  movies: Movie[];
  loading: boolean;
}

export function TrendingSection({ movies, loading }: TrendingSectionProps) {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl tracking-wider uppercase text-foreground">
          <span className="text-primary">Trending</span> Now
        </h2>
      </div>
      <ResultsGrid loading={loading} movies={movies} />
    </div>
  );
}