"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import {
  Plus,
  Star,
  Clock,
  Calendar,
  Globe,
  BookmarkCheck,
  Play,
  X,
} from "lucide-react";
import {
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getReleaseYear,
  getMovieVideos,
  getMovieEmbedUrl,
} from "@/lib/api";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";
import type { Movie, MediaType, Video } from "@/types";

interface MoviePageClientProps {
  movie: Movie;
  mediaType: MediaType;
}

export function MoviePageClient({ movie, mediaType }: MoviePageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const { toggle, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id, mediaType);

  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";

  // Video modal state
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(true);

  // Fetch embed URL and trailer on mount
  useEffect(() => {
    async function fetchVideoSources() {
      setIsLoadingUrl(true);
      try {
        const url = getMovieEmbedUrl(movie.id);
        setEmbedUrl(url);

        const videos = await getMovieVideos(movie.id);
        const trailer = videos.find(
          (v: Video) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (error) {
        console.error("Failed to fetch video sources:", error);
      } finally {
        setIsLoadingUrl(false);
      }
    }
    fetchVideoSources();
  }, [movie.id]);

  // Open modal with movie or trailer
  const openMovie = () => {
    if (!embedUrl) return;
    setModalVideoUrl(embedUrl);
    setModalTitle(`${title} - Full Movie`);
    setModalOpen(true);
  };

  const openTrailer = () => {
    if (!trailerKey) return;
    setModalVideoUrl(`https://www.youtube.com/embed/${trailerKey}?autoplay=1`);
    setModalTitle(`${title} - Trailer`);
    setModalOpen(true);
  };

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
      );
      gsap.fromTo(
        infoRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 },
      );
    });
    return () => ctx.revert();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  return (
    <div className="min-h-screen bg-background top-0">
      {/* Hero Banner */}
      <div ref={heroRef}>
        <div className="relative w-full aspect-video max-h-[70vh] bg-black">
          <Image
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-black/30 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div ref={infoRef} className="mx-auto max-w-6xl px-4 md:px-8 py-8">
        {/* Movie Details */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block shrink-0">
            <div className="relative w-48 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-border">
              <Image
                src={getPosterUrl(movie.poster_path, "w500")}
                alt={title}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="font-display text-4xl md:text-6xl tracking-wider uppercase text-foreground leading-none">
                {title}
              </h1>
              {movie.tagline && (
                <p className="text-muted-foreground text-sm italic mt-1">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-xs font-semibold px-3 py-1 rounded-full">
                <Star className="h-3 w-3 fill-current" /> {rating}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
                <Calendar className="h-3 w-3" /> {year}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" /> {Math.floor(movie.runtime / 60)}
                  h {movie.runtime % 60}m
                </span>
              )}
              {movie.original_language && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full uppercase">
                  <Globe className="h-3 w-3" /> {movie.original_language}
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-medium text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {!isLoadingUrl && embedUrl && (
                <button
                  onClick={openMovie}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Play Movie
                </button>
              )}
              {trailerKey && (
                <button
                  onClick={openTrailer}
                  className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Play Trailer
                </button>
              )}
              <button
                onClick={() => toggle(movie, mediaType)}
                className={cn(
                  "flex items-center gap-2 border px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105",
                  inWatchlist
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:bg-accent",
                )}
              >
                {inWatchlist ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ── CAST SECTION (unchanged) ── */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl tracking-wider uppercase text-foreground mb-4">
              <span className="text-primary">Top</span> Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {movie.credits.cast.slice(0, 12).map((member) => (
                <div key={member.id} className="shrink-0 w-24 text-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border mb-2 mx-auto bg-muted">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl text-muted-foreground">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {member.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL POPUP FOR VIDEO ── */}
      {modalOpen && modalVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 z-10 bg-black/60 rounded-full p-2 hover:bg-black/80 transition"
              aria-label="Close video"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={modalVideoUrl}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={modalTitle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}