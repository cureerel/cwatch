"use client";

import { useEffect, useState } from "react";
import { MovieList } from "@/components/MovieList";
import { discoverByGenre } from "@/lib/api";
import type { Movie } from "@/types";

export function GenreMovies({ genreId }: { genreId: number }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    discoverByGenre("movie", genreId)
      .then((data) => setMovies(data.results))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [genreId]);

  return (
    <MovieList
      title="Genre Results"
      movies={movies}
      mediaType="movie"
      isLoading={loading}
    />
  );
}
