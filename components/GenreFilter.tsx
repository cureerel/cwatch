"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types";

const genreColors: Record<number, string> = {
  28: "bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/30",
  12: "bg-amber-500/15 text-amber-400 border-amber-500/25 hover:bg-amber-500/30",
  16: "bg-blue-500/15 text-blue-400 border-blue-500/25 hover:bg-blue-500/30",
  35: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25 hover:bg-yellow-500/30",
  80: "bg-purple-500/15 text-purple-400 border-purple-500/25 hover:bg-purple-500/30",
  18: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/30",
  14: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/30",
  27: "bg-red-900/20 text-red-300 border-red-900/30 hover:bg-red-900/40",
  10749: "bg-pink-500/15 text-pink-400 border-pink-500/25 hover:bg-pink-500/30",
  878: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25 hover:bg-cyan-500/30",
  53: "bg-orange-500/15 text-orange-400 border-orange-500/25 hover:bg-orange-500/30",
  37: "bg-amber-700/15 text-amber-500 border-amber-700/25 hover:bg-amber-700/30",
};

const defaultColor =
  "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground";

interface GenreFilterProps {
  genres: Genre[];
  activeGenre: number | null;
  onSelect: (id: number | null) => void;
}

export function GenreFilter({ genres, activeGenre, onSelect }: GenreFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || animatedRef.current) return;
    animatedRef.current = true;
    const pills = containerRef.current.querySelectorAll(".genre-pill");
    gsap.fromTo(
      pills,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.03, ease: "back.out(1.4)" },
    );
  }, [genres]);

  return (
    <div className="py-3">
      {/* Title — no-underline + no font-display to avoid decoration bleed */}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-widest uppercase px-4 md:px-6 mb-3 no-underline decoration-transparent">
        <span className="text-accent">Select</span>{" "}
        <span className="text-foreground">Genre</span>
      </h2>

      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-6 pb-1"
      >
        {/* "All" chip */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "genre-pill shrink-0 inline-flex items-center h-7 px-3 rounded-full border text-[11px] font-medium tracking-wide transition-all duration-200 active:scale-95",
            activeGenre === null
              ? "bg-accent text-accent-foreground border-accent shadow-sm shadow-accent/20"
              : defaultColor,
          )}
        >
          All
        </button>

        {genres.map((genre) => {
          const isActive = activeGenre === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onSelect(isActive ? null : genre.id)}
              className={cn(
                "genre-pill shrink-0 inline-flex items-center h-7 px-3 rounded-full border text-[11px] font-medium tracking-wide uppercase transition-all duration-200 active:scale-95",
                isActive
                  ? "bg-accent text-accent-foreground border-accent shadow-sm shadow-accent/20"
                  : (genreColors[genre.id] ?? defaultColor),
              )}
            >
              {genre.name}
            </button>
          );
        })}
      </div>

      {/* Hint — touch devices only */}
      <p className="text-[10px] text-muted-foreground/50 px-4 md:px-6 mt-2 tracking-widest uppercase md:hidden">
        Swipe to explore →
      </p>
    </div>
  );
}