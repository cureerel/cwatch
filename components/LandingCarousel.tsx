"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getPosterUrl, getTitle, getReleaseYear } from "@/lib/api";
import type { Movie } from "@/types";
import { cn } from "@/lib/utils";

interface LandingCarouselProps {
  movies: Movie[];
  autoRotateInterval?: number; // Configurable interval in ms
  pauseOnHover?: boolean;
}

export function LandingCarousel({
  movies,
  autoRotateInterval = 4000,
  pauseOnHover = true,
}: LandingCarouselProps) {
  const [center, setCenter] = useState(Math.floor(movies.length / 2));
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const isUserInteracting = useRef(false);

  // Navigate to next slide
  const goNext = useCallback(() => {
    setCenter((prev) => (prev + 1) % movies.length);
    setProgress(0);
  }, [movies.length]);

  const goPrev = useCallback(() => {
    setCenter((prev) => (prev - 1 + movies.length) % movies.length);
    setProgress(0);
  }, [movies.length]);

  const goTo = useCallback((index: number) => {
    setCenter(index);
    setProgress(0);
  }, []);

  // Start auto-rotation
  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Main rotation interval
    intervalRef.current = setInterval(() => {
      if (!isUserInteracting.current && !isPaused) {
        goNext();
      }
    }, autoRotateInterval);

    // Progress bar update (60fps)
    const progressStep = 100 / (autoRotateInterval / 16);
    progressIntervalRef.current = setInterval(() => {
      if (!isUserInteracting.current && !isPaused) {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + progressStep;
        });
      }
    }, 16);
  }, [autoRotateInterval, isPaused, goNext]);

  // Stop auto-rotation
  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Handle user interaction
  const handleUserInteraction = useCallback((action: () => void) => {
    isUserInteracting.current = true;
    setProgress(0);
    action();

    // Resume auto-rotate after 5 seconds of inactivity
    setTimeout(() => {
      isUserInteracting.current = false;
    }, 5000);
  }, []);

  // Initialize auto-rotate
  useEffect(() => {
    startAutoRotate();
    return () => stopAutoRotate();
  }, [startAutoRotate, stopAutoRotate]);

  // Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const getCardProps = (index: number) => {
    const diff = index - center;
    const abs = Math.abs(diff);
    if (abs > 2) return null;

    const xMap = { "0": 0, "1": 180, "-1": -180, "2": 320, "-2": -320 };
    const xMapLg = { "0": 0, "1": 240, "-1": -240, "2": 420, "-2": -420 };
    const scaleMap: Record<number, number> = { 0: 1, 1: 0.75, 2: 0.55 };
    const zMap: Record<number, number> = { 0: 30, 1: 20, 2: 10 };
    const opMap: Record<number, number> = { 0: 1, 1: 0.6, 2: 0.3 };

    return {
      x: xMap[String(diff) as keyof typeof xMap] ?? diff * 150,
      xLg: xMapLg[String(diff) as keyof typeof xMapLg] ?? diff * 200,
      scale: scaleMap[abs] ?? 0.4,
      zIndex: zMap[abs] ?? 1,
      opacity: opMap[abs] ?? 0,
    };
  };

  if (!movies.length) return null;

  const currentMovie = movies[center];

  return (
    <div
      className="relative"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{ height: "clamp(320px, 50vh, 480px)", perspective: "1200px" }}
      >
        {movies.map((movie, index) => {
          const props = getCardProps(index);
          if (!props) return null;
          const isCenter = index === center;
          const title = getTitle(movie);
          const year = getReleaseYear(movie);
          const rating = movie.vote_average?.toFixed(1);
          const mediaType = movie.media_type ?? "movie";

          return (
            <div
              key={movie.id}
              className="absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer will-change-transform"
              style={{
                transform: `translateX(${props.x}px) scale(${props.scale})`,
                zIndex: props.zIndex,
                opacity: props.opacity,
              }}
              onClick={() => {
                if (isCenter) return;
                handleUserInteraction(() => goTo(index));
              }}
            >
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-500",
                  isCenter
                    ? "border-accent shadow-accent/20 w-40 sm:w-48 lg:w-56 h-60 sm:h-72 lg:h-80"
                    : "border-border/20 w-32 sm:w-36 lg:w-44 h-48 sm:h-52 lg:h-64 grayscale-30 hover:grayscale-0",
                )}
              >
                <Image
                  src={getPosterUrl(movie.poster_path, "w500")}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
                  priority={isCenter}
                />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white font-semibold">
                    {rating}
                  </span>
                </div>

                {/* Center Card Overlay */}
                {isCenter && (
                  <>
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-accent transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={`/${mediaType}/${movie.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="h-14 w-14 rounded-full bg-accent/90 backdrop-blur-md border-2 border-white/40 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-white fill-white ml-1" />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-sm line-clamp-1 mb-0.5">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 text-white/70 text-xs">
                        <span>{year}</span>
                        <span>·</span>
                        <span className="capitalize">{mediaType}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={() => handleUserInteraction(goPrev)}
          className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 opacity-0 lg:group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleUserInteraction(goNext)}
          className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 opacity-0 lg:group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleUserInteraction(() => goTo(index))}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === center
                ? "w-8 bg-accent"
                : "w-1.5 bg-border hover:bg-accent/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === center && (
              <div
                className="h-full bg-white/30 rounded-full"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Current Movie Title (Mobile) */}
      <div className="lg:hidden mt-6 text-center px-4">
        <h3 className="font-display text-xl text-foreground line-clamp-1">
          {getTitle(currentMovie)}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {getReleaseYear(currentMovie)} ·{" "}
          {(currentMovie.media_type ?? "movie").toUpperCase()}
        </p>
      </div>
    </div>
  );
}
