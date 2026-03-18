"use client";

import { useState } from "react";
import { MovieList } from "@/components/MovieList";
import { GenreFilter } from "@/components/GenreFilter";
import { GenreMovies } from "@/components/GenreMovies";
import type { Movie, Genre } from "@/types";

interface HomeClientProps {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
  genres: Genre[];
}

export function HomeClient({
  trending,
  popular,
  topRated,
  nowPlaying,
  upcoming,
  genres,
}: HomeClientProps) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);

  return (
    <div className="space-y-2 pb-8">
      {/* Latest release = now playing */}
      <MovieList
        title="Latest Release"
        movies={nowPlaying}
        mediaType="movie"
        href="/home?tab=now-playing"
      />

      {/* Top trending with rank numbers */}
      <MovieList
        title="Top Trending"
        movies={trending}
        mediaType="movie"
        showRank
        href="/home?tab=trending"
      />

      {/* Popular movies */}
      <MovieList
        title="Popular Now"
        movies={popular}
        mediaType="movie"
        href="/home?tab=popular"
      />

      {/* Genre filter + results */}
      <GenreFilter
        genres={genres}
        activeGenre={activeGenre}
        onSelect={setActiveGenre}
      />

      {activeGenre ? (
        <GenreMovies genreId={activeGenre} />
      ) : (
        <>
          <MovieList
            title="Top Rated"
            movies={topRated}
            mediaType="movie"
            href="/home?tab=top-rated"
          />
          <MovieList
            title="Coming Soon"
            movies={upcoming}
            mediaType="movie"
            href="/home?tab=upcoming"
          />
        </>
      )}
    </div>
  );
}
