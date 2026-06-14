"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Play, ChevronLeft, ChevronRight, Star, Info } from "lucide-react";
import {
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getReleaseYear,
} from "@/lib/api";
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
  const router = useRouter();

  const visibleMovies = movies.slice(0, 8);

  const preloadBackdrop = useCallback((movie: Movie) => {
    return new Promise((resolve) => {
      if (!movie.backdrop_path) { resolve(true); return; }
      const img = new window.Image();
      img.src = getBackdropUrl(movie.backdrop_path, "original");
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
    });
  }, []);

  const animateTransition = useCallback(
    async (nextIndex: number) => {
      if (transitioning || nextIndex === active) return;
      const nextMovie = visibleMovies[nextIndex];
      if (!nextMovie) return;

      await preloadBackdrop(nextMovie);
      setTransitioning(true);

      const tl = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => setTransitioning(false),
      });
      
      gsap.killTweensOf([contentRef.current, backdropRef.current]);

      if (contentRef.current) {
        tl.to(contentRef.current, {
          y: 12,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        });
      }
      if (backdropRef.current) {
        tl.to(backdropRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        }, "<");
      }
      tl.call(() => setActive(nextIndex));
      if (backdropRef.current) {
        tl.to(backdropRef.current, {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
        });
      }
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
          "<0.08",
        );
      }
    },
    [active, transitioning, visibleMovies, preloadBackdrop],
  );

  const goPrev = () =>
    animateTransition((active - 1 + visibleMovies.length) % visibleMovies.length);
  const goNext = () =>
    animateTransition((active + 1) % visibleMovies.length);
  const goTo = (i: number) => animateTransition(i);

  useEffect(() => {
    if (!visibleMovies.length) return;
    const prev = (active - 1 + visibleMovies.length) % visibleMovies.length;
    const next = (active + 1) % visibleMovies.length;
    preloadBackdrop(visibleMovies[prev]);
    preloadBackdrop(visibleMovies[next]);
  }, [active, visibleMovies, preloadBackdrop]);

  if (!visibleMovies.length) return <HeroSkeleton />;

  const current = visibleMovies[active];
  const title = getTitle(current);
  const year = getReleaseYear(current);
  const rating = current.vote_average?.toFixed(1) ?? "N/A";

  return (
    <section className="relative w-full overflow-hidden bg-black min-h-[520px] sm:min-h-[580px] lg:min-h-[680px]">

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
        {/* Single gradient set — no dark: variants to avoid theme flash */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />
      </div>

      {/* Content — always anchored to bottom, no justify switch */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 z-10 px-5 sm:px-10 md:px-14 pb-10 sm:pb-12 max-w-xl"
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2.5">
          <span className="flex items-center gap-1 bg-amber-400/15 border border-amber-400/30 text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            <Star className="h-2.5 w-2.5 fill-amber-400" /> {rating}
          </span>
          <span className="text-[11px] text-white/50">{year}</span>
          {current.runtime && (
            <span className="text-[11px] text-white/50">
              · {Math.floor(current.runtime / 60)}h {current.runtime % 60}m
            </span>
          )}
          {current.number_of_seasons && (
            <span className="text-[11px] text-white/50">
              · {current.number_of_seasons} Season
              {current.number_of_seasons > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-[1.05] mb-2 sm:mb-3">
          {title}
        </h1>

        {/* Description */}
        <p className="text-[12px] sm:text-sm text-white/55 leading-relaxed mb-4 sm:mb-5 line-clamp-2">
          {current.overview}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Play — triggers direct navigation to player */}
          <button
            onClick={() => router.push(`/${mediaType}/${current.id}?autoplay=1`)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 shadow-lg shadow-rose-900/30"
          >
            <Play className="h-4 w-4 fill-white" />
            Play
          </button>

          {/* More Info — bordered, no fill */}
          <Link
            href={`/${mediaType}/${current.id}`}
            className="flex items-center gap-2 text-white/75 hover:text-white bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95"
          >
            <Info className="h-4 w-4" />
            More Info
          </Link>
        </div>
      </div>

      {/* Thumbnail strip — desktop only */}
      <div className="absolute bottom-10 right-5 md:right-12 z-10 hidden lg:flex items-end gap-2.5">
        {visibleMovies.map((movie, i) => {
          const isActive = i === active;
          return (
            <button
              key={movie.id}
              onClick={() => goTo(i)}
              className={cn(
                "relative rounded-xl overflow-hidden transition-all duration-400 border-2",
                isActive
                  ? "w-24 h-36 border-rose-500 shadow-lg shadow-rose-900/40"
                  : "w-14 h-20 border-transparent opacity-40 hover:opacity-70 hover:w-16",
              )}
            >
              <Image
                src={getPosterUrl(movie.poster_path, "w342")}
                alt={getTitle(movie)}
                fill
                className="object-cover"
                sizes="96px"
              />
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[9px] font-semibold line-clamp-2 leading-tight">
                      {getTitle(movie)}
                    </p>
                    <div className="mt-1.5 h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full animate-[grow_6s_linear_infinite]" />
                    </div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Chevrons */}
      <button
        onClick={goPrev}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dot nav — mobile only */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 lg:hidden">
        {visibleMovies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-5 bg-rose-500" : "w-1.5 bg-white/35",
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div
      className="relative w-full bg-black animate-pulse"
      style={{ height: "clamp(380px, 60vh, 680px)" }}
    >
      <div className="absolute bottom-10 left-5 sm:left-10 space-y-3">
        <div className="h-5 w-16 rounded-full bg-white/10" />
        <div className="h-10 sm:h-14 w-52 sm:w-72 rounded-lg bg-white/10" />
        <div className="h-3.5 w-48 rounded bg-white/10" />
        <div className="h-3.5 w-36 rounded bg-white/10" />
        <div className="flex gap-2.5 mt-4">
          <div className="h-10 w-24 rounded-xl bg-white/10" />
          <div className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}