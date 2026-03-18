"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Search, X, TrendingUp, Film, Tv } from "lucide-react";
import { searchMulti, getTrending } from "@/lib/api";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";
import { setSearchQuery } from "@/store/slices/uiSlice";
import { setSearchResults } from "@/store/slices/moviesSlice";
import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "movie" | "tv";

export function SearchClient() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((s: RootState) => s.ui.searchQuery);
  const searchResults = useAppSelector(
    (s: RootState) => s.movies.searchResults,
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(
      heroRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
    );
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    getTrending("all", "week")
      .then((d) => setTrendingMovies(d.results.slice(0, 12)))
      .catch(() => {})
      .finally(() => setTrendingLoading(false));
  }, []);

  const performSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        dispatch(setSearchResults([]));
        dispatch(setSearchQuery(""));
        return;
      }
      setLoading(true);
      dispatch(setSearchQuery(q));
      try {
        const data = await searchMulti(q);
        const filtered = data.results.filter(
          (m: Movie) => m.media_type === "movie" || m.media_type === "tv",
        );
        dispatch(setSearchResults(filtered));
        if (resultsRef.current) {
          const cards = resultsRef.current.querySelectorAll(".search-card");
          gsap.fromTo(
            cards,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: "power2.out",
            },
          );
        }
      } catch {
        dispatch(setSearchResults([]));
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) performSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(val);
      const params = new URLSearchParams();
      if (val) params.set("q", val);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 420);
  };

  const clearSearch = () => {
    setInputValue("");
    dispatch(setSearchResults([]));
    dispatch(setSearchQuery(""));
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  };

  const filteredResults: Movie[] =
    filter === "all"
      ? searchResults
      : searchResults.filter((m: Movie) => m.media_type === filter);

  const hasResults = searchResults.length > 0;
  const showTrending = !inputValue.trim() && !hasResults;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
      <div ref={heroRef} className="text-center mb-10">
        <h1 className="font-display text-5xl md:text-7xl tracking-wider uppercase text-foreground mb-2">
          <span className="text-primary">Find</span> Anything
        </h1>
        <p className="text-muted-foreground text-sm">
          Search across thousands of movies and TV shows
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search movies, TV shows..."
          className="w-full bg-card border border-border rounded-2xl pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {hasResults && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["all", "movie", "tv"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {f === "movie" && <Film className="h-3.5 w-3.5" />}
              {f === "tv" && <Tv className="h-3.5 w-3.5" />}
              {f === "all" && <Search className="h-3.5 w-3.5" />}
              {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}
              <span className="text-xs opacity-60">
                (
                {f === "all"
                  ? searchResults.length
                  : searchResults.filter((m: Movie) => m.media_type === f)
                      .length}
                )
              </span>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && hasResults && (
        <div ref={resultsRef}>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            {filteredResults.length} result
            {filteredResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}
            &rdquo;
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map((movie: Movie) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type}`}
                movie={movie}
                mediaType={movie.media_type ?? "movie"}
                className="search-card w-full"
              />
            ))}
          </div>
        </div>
      )}

      {!loading && inputValue && !hasResults && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="font-display text-2xl tracking-wider text-foreground mb-2">
            No Results Found
          </h3>
          <p className="text-muted-foreground text-sm">
            Try a different title, actor, or genre
          </p>
        </div>
      )}

      {showTrending && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl tracking-wider uppercase text-foreground">
              <span className="text-primary">Trending</span> Now
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {trendingLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))
              : trendingMovies.map((movie: Movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    mediaType={movie.media_type ?? "movie"}
                    className="w-full"
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
