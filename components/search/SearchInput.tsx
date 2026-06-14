import { Search, X } from "lucide-react";
import { forwardRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear }, ref) => {
    return (
      <div className="relative max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Search for a movie, TV show, or person..."
            className="w-full bg-card border border-border rounded-full py-4 sm:py-5 pl-14 pr-14 text-base sm:text-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500/60 transition-all"
          />
          {value && (
            <button
              onClick={onClear}
              className="absolute right-5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Try “Inception”, “Stranger Things”, or “Leonardo DiCaprio”
        </p>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";