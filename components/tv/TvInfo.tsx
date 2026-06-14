import { Plus, Star, Calendar, Globe, BookmarkCheck, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTitle, getReleaseYear } from "@/lib/api";
import type { Movie } from "@/types";

interface TvInfoProps {
  show: Movie;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export function TvInfo({ show, inWatchlist, onToggleWatchlist }: TvInfoProps) {
  const name = getTitle(show);
  const year = getReleaseYear(show);
  const rating = show.vote_average?.toFixed(1) ?? "N/A";
  const totalSeasons = show.number_of_seasons ?? 1;

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      {/* Poster - hidden on mobile */}
      <div className="hidden md:block shrink-0">
        <div className="relative w-40 lg:w-44 rounded-2xl overflow-hidden shadow-2xl border border-border aspect-2/3">
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="flex-1 space-y-3 md:space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2.5 py-0.5 rounded-full">
            TV Series
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase text-foreground leading-none mt-2">
            {name}
          </h1>
          {show.tagline && (
            <p className="text-muted-foreground text-xs md:text-sm italic mt-1">
              {show.tagline}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-xs font-semibold px-3 py-1 rounded-full">
            <Star className="h-3 w-3 fill-current" /> {rating}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            <Calendar className="h-3 w-3" /> {year}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
            <Tv className="h-3 w-3" /> {totalSeasons} Season{totalSeasons > 1 ? "s" : ""}
          </span>
          {show.original_language && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full uppercase">
              <Globe className="h-3 w-3" /> {show.original_language}
            </span>
          )}
        </div>

        {show.genres && show.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {show.genres.map((g) => (
              <span key={g.id} className="text-xs font-medium text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                {g.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-muted-foreground leading-relaxed text-sm max-w-2xl line-clamp-3 md:line-clamp-none">
          {show.overview}
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3 pt-1">
          <button
            onClick={onToggleWatchlist}
            className={cn(
              "flex items-center gap-2 border px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105",
              inWatchlist
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-accent"
            )}
          >
            {inWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {inWatchlist ? "Saved" : "Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}