"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Play,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
} from "lucide-react";
import {
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getReleaseYear,
} from "@/lib/api";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import type { Movie, MediaType } from "@/types";

interface HeroSectionProps {
  movies: Movie[];
  mediaType?: MediaType;
}

export function HeroSection({ movies, mediaType = "movie" }: HeroSectionProps) {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toggle, isInWatchlist } = useWatchlist();

  const visibleMovies = movies.slice(0, 8);

  const animateTransition = useCallback(
    (nextIndex: number) => {
      if (transitioning || nextIndex === active) return;
      setTransitioning(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setActive(nextIndex);
          setTransitioning(false);
        },
      });

      if (contentRef.current) {
        tl.to(contentRef.current, {
          x: -60,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        });
      }
      if (backdropRef.current) {
        tl.to(
          backdropRef.current,
          { opacity: 0, duration: 0.3, ease: "power2.in" },
          "<",
        );
        tl.to(
          backdropRef.current,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          "+=0.05",
        );
      }
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          "<0.1",
        );
      }
    },
    [active, transitioning],
  );

  useEffect(() => {
    timerRef.current = setInterval(() => {
      animateTransition((active + 1) % visibleMovies.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, visibleMovies.length, animateTransition]);

  const goPrev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    animateTransition(
      (active - 1 + visibleMovies.length) % visibleMovies.length,
    );
  };
  const goNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    animateTransition((active + 1) % visibleMovies.length);
  };
  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    animateTransition(i);
  };

  if (!visibleMovies.length) return <HeroSkeleton />;

  const current = visibleMovies[active];
  const title = getTitle(current);
  const year = getReleaseYear(current);
  const rating = current.vote_average?.toFixed(1) ?? "N/A";
  const inWatchlist = isInWatchlist(current.id, mediaType);

  return (
    <section className="relative w-full h-[85vh] min-h-140 overflow-hidden bg-background">
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0">
        <Image
          key={current.id}
          src={getBackdropUrl(current.backdrop_path, "original")}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-end h-full pb-10 px-6 md:px-12 lg:px-16 max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Star className="h-3 w-3 fill-accent" /> {rating}
          </span>
          <span className="text-xs text-muted-foreground">{year}</span>
          {current.runtime && (
            <span className="text-xs text-muted-foreground">
              · {Math.floor(current.runtime / 60)}h {current.runtime % 60}m
            </span>
          )}
          {current.number_of_seasons && (
            <span className="text-xs text-muted-foreground">
              · {current.number_of_seasons} Season
              {current.number_of_seasons > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-foreground uppercase leading-none mb-3">
          {title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed mb-6 line-clamp-2">
          {current.overview}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/${mediaType}/${current.id}`}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
          >
            <Play className="h-4 w-4 fill-current" /> Watch Now
          </Link>
          <button
            onClick={() => toggle(current, mediaType)}
            className={cn(
              "flex items-center gap-2 border px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105",
              inWatchlist
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface/50 backdrop-blur-sm text-foreground hover:border-foreground/40",
            )}
          >
            <Plus className={cn("h-4 w-4", inWatchlist && "rotate-45")} />
            {inWatchlist ? "Added" : "Watchlist"}
          </button>
          <Link
            href={`/${mediaType}/${current.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-3 rounded-xl text-sm transition-colors"
          >
            <Info className="h-4 w-4" /> More Info
          </Link>
        </div>
      </div>

      {/* PS5-style thumbnail strip */}
      <div
        ref={thumbnailsRef}
        className="absolute bottom-8 right-6 md:right-12 z-10 hidden lg:flex items-end gap-3"
      >
        {visibleMovies.map((movie, i) => {
          const isActive = i === active;
          return (
            <button
              key={movie.id}
              onClick={() => goTo(i)}
              className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-500 border-2",
                isActive
                  ? "w-28 h-40 border-accent shadow-lg shadow-accent/30"
                  : "w-16 h-24 border-transparent opacity-50 hover:opacity-80 hover:w-20",
              )}
            >
              <Image
                src={getPosterUrl(movie.poster_path, "w342")}
                alt={getTitle(movie)}
                fill
                className="object-cover"
                sizes="112px"
              />
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[10px] font-semibold line-clamp-2 leading-tight">
                      {getTitle(movie)}
                    </p>
                    <div className="mt-1 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-[grow_6s_linear_infinite]" />
                    </div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full glass-dark flex items-center justify-center text-foreground hover:text-accent transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full glass-dark flex items-center justify-center text-foreground hover:text-accent transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Mobile dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 lg:hidden">
        {visibleMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-accent" : "w-1.5 bg-foreground/30",
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent z-5" />
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] min-h-140 bg-surface-raised animate-pulse">
      <div className="absolute bottom-10 left-12 space-y-4">
        <div className="h-6 w-20 rounded-full bg-surface-overlay" />
        <div className="h-16 w-80 rounded bg-surface-overlay" />
        <div className="h-4 w-64 rounded bg-surface-overlay" />
        <div className="h-4 w-48 rounded bg-surface-overlay" />
        <div className="flex gap-3 mt-4">
          <div className="h-12 w-36 rounded-xl bg-surface-overlay" />
          <div className="h-12 w-28 rounded-xl bg-surface-overlay" />
        </div>
      </div>
    </div>
  );
}
