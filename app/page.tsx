// import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
// import { MovieList } from "@/components/MovieList";
import { HomeClient } from "@/components/HomeClient";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  getGenres,
} from "@/lib/api";

export default async function HomePage() {
  const [trending, popular, topRated, nowPlaying, upcoming, genresData] =
    await Promise.all([
      getTrending("movie", "week").catch(() => ({ results: [] })),
      getPopular("movie").catch(() => ({ results: [] })),
      getTopRated("movie").catch(() => ({ results: [] })),
      getNowPlaying().catch(() => ({ results: [] })),
      getUpcoming().catch(() => ({ results: [] })),
      getGenres("movie").catch(() => ({ genres: [] })),
    ]);

  return (
    <div className="min-h-screen bg-background">
      {/* PS5-style Hero */}
      <HeroSection movies={trending.results.slice(0, 8)} mediaType="movie" />

      {/* Content below hero */}
      <div className="relative z-10 -mt-2">
        <HomeClient
          trending={trending.results}
          popular={popular.results}
          topRated={topRated.results}
          nowPlaying={nowPlaying.results}
          upcoming={upcoming.results}
          genres={genresData.genres}
        />
      </div>
    </div>
  );
}
