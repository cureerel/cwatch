"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import {
  Play,
  Plus,
  Star,
  Calendar,
  Globe,
  BookmarkCheck,
  Tv,
  Clock,
  ImageOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getBackdropUrl,
  getPosterUrl,
  getTitle,
  getReleaseYear,
  getTvEmbedUrl,
  getSeasonDetails,
  TMDB_IMAGE_BASE,
} from "@/lib/api";
import { useWatchlist } from "@/hooks/useWatchlist";
import { VideoPlayer } from "@/components/VideoPlayer";
import { cn } from "@/lib/utils";
import type { Movie, TvSeason, TvEpisode } from "@/types";

export function TvPageClient({ show }: { show: Movie }) {
  const totalSeasons = show.number_of_seasons ?? 1;

  const [activeSeason, setActiveSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [seasonData, setSeasonData] = useState<TvSeason | null>(null);
  const [seasonLoading, setSeasonLoading] = useState(false);

  const cache = useRef<Record<number, TvSeason>>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const seasonTabsRef = useRef<HTMLDivElement>(null);

  const { toggle, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(show.id, "tv");

  const name = getTitle(show);
  const year = getReleaseYear(show);
  const rating = show.vote_average?.toFixed(1) ?? "N/A";
  const embedUrl = getTvEmbedUrl(show.id, activeSeason, episode);

  // ── Entrance animation ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
      );
      gsap.fromTo(
        infoRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  // ── Animate episode list in when season changes ───────────────────────
  const animateEpisodeList = useCallback(() => {
    const items = document.querySelectorAll(".ep-row");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, []);

  // ── Fetch season ──────────────────────────────────────────────────────
  const fetchSeason = useCallback(
    async (s: number) => {
      if (cache.current[s]) {
        setSeasonData(cache.current[s]);
        setTimeout(animateEpisodeList, 50);
        return;
      }
      setSeasonLoading(true);
      setSeasonData(null);
      try {
        const data = await getSeasonDetails(show.id, s);
        cache.current[s] = data;
        setSeasonData(data);
        setTimeout(animateEpisodeList, 50);
      } catch {
        setSeasonData(null);
      } finally {
        setSeasonLoading(false);
      }
    },
    [show.id, animateEpisodeList],
  );

  // Fetch season 1 on mount
  useEffect(() => {
    fetchSeason(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Switch season ─────────────────────────────────────────────────────
  const switchSeason = (s: number) => {
    if (s === activeSeason) return;
    setActiveSeason(s);
    setEpisode(1);
    setPlaying(false);
    fetchSeason(s);
    // Scroll the season tabs to keep selected visible
    const tab = seasonTabsRef.current?.querySelector(`[data-season="${s}"]`);
    tab?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  // ── Play an episode ───────────────────────────────────────────────────
  const playEpisode = (ep: number) => {
    setEpisode(ep);
    setPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevSeason = () => activeSeason > 1 && switchSeason(activeSeason - 1);
  const nextSeason = () =>
    activeSeason < totalSeasons && switchSeason(activeSeason + 1);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* ── Player / Backdrop ─────────────────────────────────────────── */}
      <div ref={heroRef}>
        {playing ? (
          <VideoPlayer
            src={embedUrl}
            title={`${name} S${String(activeSeason).padStart(2, "0")}E${String(episode).padStart(2, "0")}`}
            onClose={() => setPlaying(false)}
          />
        ) : (
          <div
            className="relative w-full bg-black"
            style={{ aspectRatio: "16/9", maxHeight: "68vh" }}
          >
            <Image
              src={getBackdropUrl(show.backdrop_path, "original")}
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-black/20 to-black/50" />

            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Play Season ${activeSeason} Episode ${episode}`}
            >
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-2xl shadow-primary/40">
                <Play className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground fill-current ml-1" />
              </div>
            </button>

            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-2">
              <Tv className="h-3 w-3 text-white/70" />
              <span className="text-white text-xs font-medium">
                S{String(activeSeason).padStart(2, "0")} · E
                {String(episode).padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div
        ref={infoRef}
        className="mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-8 space-y-8 md:space-y-10"
      >
        {/* ── Show meta ──────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster — hidden on mobile */}
          <div className="hidden md:block shrink-0">
            <div className="relative w-40 lg:w-44 rounded-2xl overflow-hidden shadow-2xl border border-border aspect-2/3">
              <Image
                src={getPosterUrl(show.poster_path, "w500")}
                alt={name}
                fill
                className="object-cover"
                sizes="176px"
              />
            </div>
          </div>

          <div className="flex-1 space-y-3 md:space-y-4">
            {/* Title */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2.5 py-0.5 rounded-full">
                TV Series
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase text-foreground leading-none mt-2">
                {name}
              </h1>
              {show.tagline && (
                <p className="text-muted-foreground text-xs md:text-sm italic mt-1">
                  {show.tagline}
                </p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-xs font-semibold px-3 py-1 rounded-full">
                <Star className="h-3 w-3 fill-current" /> {rating}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
                <Calendar className="h-3 w-3" /> {year}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">
                <Tv className="h-3 w-3" /> {totalSeasons} Season
                {totalSeasons > 1 ? "s" : ""}
              </span>
              {show.original_language && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full uppercase">
                  <Globe className="h-3 w-3" /> {show.original_language}
                </span>
              )}
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs font-medium text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-muted-foreground leading-relaxed text-sm max-w-2xl line-clamp-3 md:line-clamp-none">
              {show.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 md:gap-3 pt-1">
              <button
                onClick={() => setPlaying(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              >
                <Play className="h-4 w-4 fill-current" />
                Play S{String(activeSeason).padStart(2, "0")}E
                {String(episode).padStart(2, "0")}
              </button>
              <button
                onClick={() => toggle(show, "tv")}
                className={cn(
                  "flex items-center gap-2 border px-4 md:px-5 py-2.5 md:py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105",
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
                {inWatchlist ? "Saved" : "Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Season + Episodes browser ──────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl md:text-3xl tracking-wider uppercase text-foreground">
              <span className="text-primary">Season</span> {activeSeason}
            </h2>
            {/* Prev / Next season arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSeason}
                disabled={activeSeason === 1}
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous season"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSeason}
                disabled={activeSeason === totalSeasons}
                className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next season"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Season pill tabs */}
          <div
            ref={seasonTabsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
          >
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
              <button
                key={s}
                data-season={s}
                onClick={() => switchSeason(s)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200",
                  activeSeason === s
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                S{String(s).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* Season info bar */}
          {seasonData && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {seasonData.name}
              </span>
              {seasonData.air_date && (
                <span>{new Date(seasonData.air_date).getFullYear()}</span>
              )}
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>
                {seasonData.episodes?.length ?? seasonData.episode_count}{" "}
                episodes
              </span>
            </div>
          )}

          {/* Episode list */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {seasonLoading ? (
              /* Skeleton */
              <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 md:p-4 animate-pulse">
                    <div
                      className="w-28 md:w-36 shrink-0 rounded-lg bg-muted"
                      style={{ aspectRatio: "16/9" }}
                    />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3.5 w-3/4 rounded bg-muted" />
                      <div className="h-3 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !seasonData || !seasonData.episodes?.length ? (
              <div className="p-10 text-center text-muted-foreground text-sm">
                No episode data available for this season.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {seasonData.episodes.map((ep: TvEpisode) => {
                  const isNowPlaying = episode === ep.episode_number && playing;
                  const isSelected = episode === ep.episode_number;

                  return (
                    <button
                      key={ep.id}
                      onClick={() => playEpisode(ep.episode_number)}
                      className={cn(
                        "ep-row w-full flex items-start gap-3 p-3 md:p-4 text-left transition-colors group",
                        isNowPlaying
                          ? "bg-primary/10"
                          : isSelected
                            ? "bg-accent/60"
                            : "hover:bg-accent/40",
                      )}
                    >
                      {/* Thumbnail */}
                      <div
                        className="relative w-28 md:w-36 shrink-0 rounded-lg overflow-hidden bg-muted border border-border"
                        style={{ aspectRatio: "16/9" }}
                      >
                        {ep.still_path ? (
                          <Image
                            src={`${TMDB_IMAGE_BASE}/w300${ep.still_path}`}
                            alt={ep.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 112px, 144px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageOff className="h-4 w-4 text-muted-foreground/30" />
                          </div>
                        )}

                        {/* Play overlay */}
                        <div
                          className={cn(
                            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                            isNowPlaying
                              ? "opacity-100 bg-black/50"
                              : "opacity-0 group-hover:opacity-100 bg-black/40",
                          )}
                        >
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Play className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary-foreground fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Ep number badge */}
                        <div className="absolute top-1 left-1 bg-black/75 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                          E{String(ep.episode_number).padStart(2, "0")}
                        </div>

                        {/* Now playing pill */}
                        {isNowPlaying && (
                          <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-primary text-primary-foreground text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded">
                            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                            PLAYING
                          </div>
                        )}
                      </div>

                      {/* Episode info */}
                      <div className="flex-1 min-w-0 pt-0.5 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold leading-snug line-clamp-2 md:line-clamp-1",
                              isNowPlaying ? "text-primary" : "text-foreground",
                            )}
                          >
                            {ep.episode_number}. {ep.name}
                          </p>
                          {/* Runtime + rating — hidden on very small screens */}
                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            {ep.runtime && (
                              <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                                <Clock className="h-3 w-3" />
                                {ep.runtime}m
                              </span>
                            )}
                            {ep.vote_average > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 whitespace-nowrap">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                {ep.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        {ep.air_date && (
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {new Date(ep.air_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}

                        {ep.overview && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden sm:block">
                            {ep.overview}
                          </p>
                        )}

                        {/* Mobile runtime row */}
                        <div className="flex items-center gap-2 sm:hidden">
                          {ep.runtime && (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {ep.runtime}m
                            </span>
                          )}
                          {ep.vote_average > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              {ep.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Cast ──────────────────────────────────────────────────── */}
        {show.credits?.cast && show.credits.cast.length > 0 && (
          <div>
            <h2 className="font-display text-2xl tracking-wider uppercase text-foreground mb-4">
              <span className="text-primary">Top</span> Cast
            </h2>
            <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
              {show.credits.cast.slice(0, 15).map((member) => (
                <div
                  key={member.id}
                  className="shrink-0 w-20 md:w-24 text-center"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border mb-2 mx-auto bg-muted">
                    {member.profile_path ? (
                      <Image
                        src={`${TMDB_IMAGE_BASE}/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg text-muted-foreground">
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
    </div>
  );
}
