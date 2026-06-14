import { Search, Film, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "movie" | "tv";

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  moviesCount: number;
  tvCount: number;
}

export function FilterTabs({
  filter,
  onFilterChange,
  totalCount,
  moviesCount,
  tvCount,
}: FilterTabsProps) {
  const tabs = [
    { key: "all" as const, label: "All", icon: <Search className="h-3.5 w-3.5" />, count: totalCount },
    { key: "movie" as const, label: "Movies", icon: <Film className="h-3.5 w-3.5" />, count: moviesCount },
    { key: "tv" as const, label: "TV Shows", icon: <Tv className="h-3.5 w-3.5" />, count: tvCount },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={cn(
            "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all border",
            filter === tab.key
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {tab.icon}
          {tab.label}
          <span className="text-[10px] sm:text-xs opacity-60">({tab.count})</span>
        </button>
      ))}
    </div>
  );
}