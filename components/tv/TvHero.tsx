import Image from "next/image";
import { Tv } from "lucide-react";
import { getBackdropUrl, getTitle } from "@/lib/api";
import type { Movie } from "@/types";

interface TvHeroProps {
  show: Movie;
}

export function TvHero({ show }: TvHeroProps) {
  const name = getTitle(show);

  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: "16/9", maxHeight: "68vh" }}>
      <Image
        src={getBackdropUrl(show.backdrop_path, "original")}
        alt={name}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background via-black/20 to-black/50" />
      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
        <Tv className="h-3 w-3 text-white/70" />
        <span className="text-white text-xs font-medium">{name}</span>
      </div>
    </div>
  );
}