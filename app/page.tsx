
import { HeroSection } from "@/components/HeroSection";
import { HomeClient } from "@/components/HomeClient";
import { Metadata } from "next";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  getGenres,
} from "@/lib/api";
export const metadata: Metadata = {
  metadataBase: new URL("https://cwatch.cureerel.com"),

  title: "cwatch",
  description: "Your cinematic universe. Movies, TV shows, all in one place.",

  keywords: ["movies", "tv shows", "streaming", "watch online"],

  openGraph: {
    title: "cWatch — Tap on it",
    description: "Your cinematic universe.",
    type: "website",
    images: ["/preview.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "cWatch — Tap on it",
    description: "Your cinematic universe.",
    images: ["/preview.png"],
  },
};

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
          genres={genresData.genres}
          trending={trending.results}
          popular={popular.results}
          topRated={topRated.results}
          nowPlaying={nowPlaying.results}
          upcoming={upcoming.results}
        />
      </div>
    </div>
  );
}
