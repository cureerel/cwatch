import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TvSeasonSelectorProps {
  totalSeasons: number;
  activeSeason: number;
  onSeasonChange: (season: number) => void;
  onPrev: () => void;
  onNext: () => void;
  seasonTabsRef: React.RefObject<HTMLDivElement | null>;
}

export function TvSeasonSelector({
  totalSeasons,
  activeSeason,
  onSeasonChange,
  onPrev,
  onNext,
  seasonTabsRef,
}: TvSeasonSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-display text-2xl md:text-3xl tracking-wider uppercase text-foreground">
          <span className="text-primary">Season</span> {activeSeason}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={activeSeason === 1}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNext}
            disabled={activeSeason === totalSeasons}
            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={seasonTabsRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
          <button
            key={s}
            data-season={s}
            onClick={() => onSeasonChange(s)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200",
              activeSeason === s
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            S{String(s).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}