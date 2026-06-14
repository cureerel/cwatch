"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
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
  showScrollButtons?: boolean; // new prop to enable scroll buttons
}

export function MovieList({
  title,
  movies,
  mediaType = "movie",
  isLoading = false,
  showRank = false,
  href,
  className,
  showScrollButtons = false,
}: MovieListProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

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

  // Check scroll position to show/hide buttons
  useEffect(() => {
    const container = listRef.current;
    if (!container || !showScrollButtons) return;

    const updateButtons = () => {
      setShowLeftButton(container.scrollLeft > 20);
      setShowRightButton(
        container.scrollLeft + container.clientWidth < container.scrollWidth - 20
      );
    };

    updateButtons();
    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);
    return () => {
      container.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [movies, showScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (!listRef.current) return;
    const scrollAmount = listRef.current.clientWidth * 0.8;
    listRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={sectionRef} className={cn("py-4 overflow-hidden", className)}>
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
            Drag to scroll →
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

      {/* Scroll Buttons (optional) */}
      {showScrollButtons && (
        <>
          {showLeftButton && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-2 shadow-lg border border-border hover:bg-accent/20 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightButton && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-background/80 backdrop-blur rounded-full p-2 shadow-lg border border-border hover:bg-accent/20 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          )}
        </>
      )}

      {/* Horizontal Scroll Container - no visible scrollbar */}
      <div
        ref={listRef}
        className="flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 px-4 md:px-6"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hide scrollbar for Chrome/Safari */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
                className="movie-card-item w-35 sm:w-40 md:w-45 shrink-0"
              />
            ))}
      </div>
    </section>
  );
}