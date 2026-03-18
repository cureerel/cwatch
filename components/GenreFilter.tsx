"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types";

const genreColors: Record<number, string> = {
  28: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/40",
  12: "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/40",
  16: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/40",
  35: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/40",
  80: "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/40",
  18: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/40",
  14: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/40",
  27: "bg-red-900/30 text-red-300 border-red-900/40 hover:bg-red-900/50",
  10749: "bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/40",
  878: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/40",
  53: "bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/40",
  37: "bg-amber-700/20 text-amber-500 border-amber-700/30 hover:bg-amber-700/40",
};

const defaultColor =
  "bg-surface-raised text-muted-foreground border-border hover:bg-surface-overlay hover:text-foreground";

interface GenreFilterProps {
  genres: Genre[];
  activeGenre: number | null;
  onSelect: (id: number | null) => void;
}

export function GenreFilter({
  genres,
  activeGenre,
  onSelect,
}: GenreFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const pills = containerRef.current.querySelectorAll(".genre-pill");
    gsap.fromTo(
      pills,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.5)",
      },
    );
  }, [genres]);

  return (
    <div className="py-4">
      <h2 className="font-display text-3xl md:text-4xl tracking-wider uppercase px-4 md:px-6 mb-4">
        <span className="text-accent">Select</span>{" "}
        <span className="text-foreground">Genre</span>
      </h2>
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-2"
      >
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "genre-pill shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200",
            activeGenre === null
              ? "bg-accent text-accent-foreground border-accent"
              : defaultColor,
          )}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onSelect(genre.id === activeGenre ? null : genre.id)}
            className={cn(
              "genre-pill shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium tracking-wide uppercase transition-all duration-200",
              activeGenre === genre.id
                ? "bg-accent text-accent-foreground border-accent scale-105"
                : (genreColors[genre.id] ?? defaultColor),
            )}
          >
            {genre.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground px-4 md:px-6 mt-2 tracking-widest uppercase">
        Drag to next →
      </p>
    </div>
  );
}
