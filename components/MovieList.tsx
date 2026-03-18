"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";
import type { Movie, MediaType } from "@/types";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface MovieListProps {
  title: string;
  movies: Movie[];
  mediaType?: MediaType;
  isLoading?: boolean;
  showRank?: boolean;
  href?: string;
  className?: string;
}

export function MovieList({
  title,
  movies,
  mediaType = "movie",
  isLoading = false,
  showRank = false,
  href,
  className,
}: MovieListProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
      const cards = listRef.current?.querySelectorAll(".movie-card-item");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [movies]);

  return (
    <section ref={sectionRef} className={cn("py-4", className)}>
      <div className="flex items-center justify-between px-4 md:px-6 mb-4">
        <h2
          ref={titleRef}
          className="font-display text-3xl md:text-4xl tracking-wider uppercase"
        >
          <span className="text-accent">{title.split(" ")[0]}</span>
          {title.includes(" ") && (
            <span className="text-foreground">
              {" "}
              {title.split(" ").slice(1).join(" ")}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block tracking-widest uppercase">
            Drag to next →
          </span>
          {href && (
            <Link
              href={href}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
      <div
        ref={listRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))
          : movies.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                mediaType={mediaType}
                rank={showRank ? i + 1 : undefined}
                className="movie-card-item w-35 sm:w-40 md:w-45"
              />
            ))}
      </div>
    </section>
  );
}
