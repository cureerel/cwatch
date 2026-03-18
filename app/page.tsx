"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LandingCarousel } from "@/components/LandingCarousel";
import { getTrending } from "@/lib/api";
import { Play, ChevronRight, Zap } from "lucide-react";
// Import the actual Movie type from your types folder
import { Movie } from "@/types";

export default function LandingPage() {
  // Use the imported Movie type here
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trending = await getTrending("all", "week").catch(() => ({
          results: [],
        }));
        // The API returns results that should match your Movie interface
        setMovies(trending.results.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch trending data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Split Screen Hero - Full Height */}
      <section className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left: Text Content */}
        <div className="relative z-20 flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-0 lg:w-[45%] xl:w-[40%] bg-background/95 backdrop-blur-sm">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in w-fit">
            <Zap className="h-3.5 w-3.5 text-green-400" />
            <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">
              Stream Unlimited
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[0.9] mb-6 animate-fade-in [animation-delay:100ms]">
            <span className="text-foreground block">Your</span>
            <span className="text-red-600 block mt-2">Cinematic</span>
            <span className="text-foreground block mt-2">Universe</span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed mb-8 animate-fade-in [animation-delay:200ms]">
            Thousands of movies and TV shows, zero subscriptions. Stream
            anything, anywhere, anytime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-10 animate-fade-in [animation-delay:300ms]">
            <Link
              href="/home"
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Watching
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 border border-border text-foreground hover:border-foreground/40 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-surface-raised"
            >
              Browse All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right: Carousel */}
        <div className="relative lg:w-[55%] xl:w-[60%] h-[50vh] lg:h-screen flex items-center justify-center bg-kinear-to-br from-accent/5 via-background to-background">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-primary/5 blur-[80px]" />
          </div>

          <div className="relative z-10 w-full max-w-2xl px-4 animate-fade-in [animation-delay:200ms]">
            {isLoading ? (
              <CarouselSkeleton />
            ) : (
              <LandingCarousel movies={movies} />
            )}
          </div>

          {/* Mobile Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-linear-to-b from-border to-transparent" />
          </div>
        </div>

        {/* Gradient Overlap for Mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent lg:hidden pointer-events-none" />
      </section>

      {/* CTA bottom */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-display text-4xl md:text-6xl tracking-wider uppercase text-foreground mb-6">
          Ready to <span className="text-red-600">Watch?</span>
        </h2>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent/30"
        >
          <Play className="h-5 w-5 fill-current" />
          Browse Movies & Shows
        </Link>
      </section>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 h-64 lg:h-96">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`rounded-2xl bg-surface-raised shimmer-bg ${
            i === 2
              ? "w-44 h-64 lg:w-56 lg:h-80"
              : i === 1 || i === 3
                ? "w-36 h-52 lg:w-44 lg:h-64"
                : "w-28 h-40 lg:w-36 lg:h-52"
          }`}
        />
      ))}
    </div>
  );
}
