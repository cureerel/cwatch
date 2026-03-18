import Link from "next/link";
import { Play } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="font-display text-[10rem] md:text-[16rem] leading-none mb-4 text-black dark:text-white select-none">
        404
      </div>
      <div className="-mt-12 space-y-4">
        <h1 className="font-display text-4xl md:text-6xl tracking-wider uppercase text-foreground">
          Scene <span className="text-black dark:text-white ">Not Found</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
          This page doesn&apos;t exist or was removed. Head back to the main
          stage.
        </p>
        <div className="flex gap-3 justify-center pt-4 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
          >
            <Play className="h-4 w-4 fill-current" />
            Back to Home
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 border border-border text-foreground hover:bg-surface-raised px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          >
            Search Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
