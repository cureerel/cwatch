"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Star, Bookmark, BookmarkCheck, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPosterUrl, getTitle, getReleaseYear } from "@/lib/api";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { Movie, MediaType } from "@/types";

interface MovieCardProps {
  movie: Movie;
  mediaType?: MediaType;
  rank?: number;
  className?: string;
}

export function MovieCard({
  movie,
  mediaType = "movie",
  rank,
  className,
}: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const { isInWatchlist, toggle } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id, mediaType);

  const handleMouseEnter = () => {
    if (!cardRef.current || !overlayRef.current) return;
    gsap.to(cardRef.current, {
      scale: 1.04,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !overlayRef.current) return;
    gsap.to(cardRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25 });
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(movie, mediaType);
  };

  const href = `/${mediaType === "tv" ? "tv" : "movie"}/${movie.id}`;
  const posterUrl = imgError
    ? "/placeholder-poster.jpg"
    : getPosterUrl(movie.poster_path);
  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const rating = movie.vote_average?.toFixed(1) ?? "—";

  return (
    <div
      ref={cardRef}
      className={cn("relative group cursor-pointer shrink-0", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} className="block">
        {/* Poster */}
        <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-surface-raised">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 200px"
            className="object-cover"
            onError={() => setImgError(true)}
          />

          {/* Rank badge */}
          {rank !== undefined && (
            <div className="absolute bottom-0 left-0 font-display text-[5rem] leading-none text-foreground/10 select-none pl-1">
              {rank}
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-medium text-white">{rating}</span>
          </div>

          {/* Hover Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 flex flex-col justify-end p-3 gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center shadow-lg">
                <Play className="h-4 w-4 text-white fill-white ml-0.5" />
              </div>
              <button
                onClick={handleWatchlistToggle}
                className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label={
                  inWatchlist ? "Remove from watchlist" : "Add to watchlist"
                }
              >
                {inWatchlist ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-accent" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5 text-white" />
                )}
              </button>
            </div>
            <div>
              <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                {title}
              </p>
              <p className="text-white/60 text-[10px] mt-0.5">{year}</p>
            </div>
          </div>
        </div>

        {/* Info below card */}
        <div className="mt-2 px-0.5">
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
        </div>
      </Link>
    </div>
  );
}
