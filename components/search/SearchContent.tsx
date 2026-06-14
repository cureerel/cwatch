"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { FilterTabs } from "./FilterTabs";
import { ResultsGrid } from "./ResultsGrid";
import { NoResults } from "./NoResults";
import { TrendingSection } from "./TrendingSection";
import { searchMulti, getTrending } from "@/lib/api";
import type { Movie } from "@/types";

type FilterType = "all" | "movie" | "tv";

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [trending, setTrending] = useState<Movie[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    getTrending("all", "week")
      .then((res) => setTrending(res.results.slice(0, 12)))
      .finally(() => setTrendingLoading(false));
  }, []);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setQuery("");
      return;
    }
    setLoading(true);
    setQuery(searchTerm);
    try {
      const data = await searchMulti(searchTerm);
      const filtered = data.results.filter(
        (m: Movie) => m.media_type === "movie" || m.media_type === "tv"
      );
      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
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
    }, 400);
  };

  const clearSearch = () => {
    setInputValue("");
    setResults([]);
    setQuery("");
    router.replace("/search", { scroll: false });
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredResults =
    filter === "all"
      ? results
      : results.filter((m) => m.media_type === filter);

  const moviesCount = results.filter((m) => m.media_type === "movie").length;
  const tvCount = results.filter((m) => m.media_type === "tv").length;
  const showTrending = !query && !loading && results.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <SearchInput
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onClear={clearSearch}
      />

      {results.length > 0 && (
        <>
          <FilterTabs
            filter={filter}
            onFilterChange={setFilter}
            totalCount={results.length}
            moviesCount={moviesCount}
            tvCount={tvCount}
          />
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            {filteredResults.length} result{filteredResults.length !== 1 && "s"} for “{query}”
          </p>
          <ResultsGrid loading={loading} movies={filteredResults} />
        </>
      )}

      {!loading && inputValue && results.length === 0 && (
        <NoResults query={inputValue} />
      )}

      {showTrending && (
        <TrendingSection movies={trending} loading={trendingLoading} />
      )}
    </div>
  );
}