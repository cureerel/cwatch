import Image from "next/image";
import { Clock, Star, ImageOff } from "lucide-react";
import { TMDB_IMAGE_BASE } from "@/lib/api";
import type { TvEpisode } from "@/types";

interface TvEpisodeListProps {
  episodes: TvEpisode[];
  loading: boolean;
  onPlayEpisode: (episode: TvEpisode) => void;
}

export function TvEpisodeList({ episodes, loading, onPlayEpisode }: TvEpisodeListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border animate-pulse">
            <div className="w-24 md:w-32 shrink-0 rounded-lg bg-muted" style={{ aspectRatio: "16/9" }} />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!episodes.length) {
    return (
      <div className="p-12 text-center text-muted-foreground text-sm bg-card rounded-xl border border-border">
        No episode data available for this season.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {episodes.map((ep) => (
        <button
          key={ep.id}
          onClick={() => onPlayEpisode(ep)}
          className="group w-full flex items-start gap-4 p-4 rounded-xl bg-card border border-border transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:bg-accent/10 text-left"
        >
          {/* Thumbnail */}
          <div className="relative w-24 md:w-32 shrink-0 rounded-lg overflow-hidden bg-muted" style={{ aspectRatio: "16/9" }}>
            {ep.still_path ? (
              <Image
                src={`${TMDB_IMAGE_BASE}/w300${ep.still_path}`}
                alt={ep.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 96px, 128px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageOff className="h-5 w-5 text-muted-foreground/40" />
              </div>
            )}
            {/* Episode number badge */}
            <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
              E{String(ep.episode_number).padStart(2, "0")}
            </div>
          </div>

          {/* Episode details */}
          <div className="flex-1 min-w-0 pt-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-sm md:text-base font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {ep.episode_number}. {ep.name}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                {ep.runtime && (
                  <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {ep.runtime}m
                  </span>
                )}
                {ep.vote_average > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] md:text-xs text-yellow-500 whitespace-nowrap">
                    <Star className="h-3 w-3 fill-current" />
                    {ep.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {ep.air_date && (
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {new Date(ep.air_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            )}

            {ep.overview && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden sm:block">
                {ep.overview}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}