"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { getSeasonDetails, getTvEmbedUrl } from "@/lib/api";
import { useWatchlist } from "@/hooks/useWatchlist";
import { TvHero } from "./TvHero";
import { TvInfo } from "./TvInfo";
import { TvSeasonSelector } from "./TvSeasonSelector";
import { TvEpisodeList } from "./TvEpisodeList";
import { TvCast } from "./TvCast";
import { TvEpisodePlayerModal } from "./TvEpisodePlayerModal";
import type { Movie, TvSeason, TvEpisode } from "@/types";

export function TvPageClient({ show }: { show: Movie }) {
  const totalSeasons = show.number_of_seasons ?? 1;
  const [activeSeason, setActiveSeason] = useState(1);
  const [seasonData, setSeasonData] = useState<TvSeason | null>(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [episodePlayer, setEpisodePlayer] = useState<{ url: string; title: string } | null>(null);

  const cache = useRef<Record<number, TvSeason>>({});
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const seasonTabsRef = useRef<HTMLDivElement>(null);

  const { toggle, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(show.id, "tv");

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      gsap.fromTo(
        infoRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate episode list when season changes
  const animateEpisodeList = useCallback(() => {
    const items = document.querySelectorAll(".ep-row");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
    );
  }, []);

  // Fetch season details
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
    [show.id, animateEpisodeList]
  );

  // Fetch season 1 on mount
  useEffect(() => {
    fetchSeason(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchSeason = (s: number) => {
    if (s === activeSeason) return;
    setActiveSeason(s);
    fetchSeason(s);
    const tab = seasonTabsRef.current?.querySelector(`[data-season="${s}"]`);
    tab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const prevSeason = () => activeSeason > 1 && switchSeason(activeSeason - 1);
  const nextSeason = () => activeSeason < totalSeasons && switchSeason(activeSeason + 1);

  const playEpisode = (ep: TvEpisode) => {
    const embedUrl = getTvEmbedUrl(show.id, activeSeason, ep.episode_number);
    setEpisodePlayer({
      url: embedUrl,
      title: `${show.name} - S${activeSeason}E${ep.episode_number}: ${ep.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background ">
      <div ref={heroRef}>
        <TvHero show={show} />
      </div>

      <div ref={infoRef} className="mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-8 space-y-8 md:space-y-10">
        <TvInfo
          show={show}
          inWatchlist={inWatchlist}
          onToggleWatchlist={() => toggle(show, "tv")}
        />

        <div className="space-y-4">
          <TvSeasonSelector
            totalSeasons={totalSeasons}
            activeSeason={activeSeason}
            onSeasonChange={switchSeason}
            onPrev={prevSeason}
            onNext={nextSeason}
            seasonTabsRef={seasonTabsRef}
          />

          {seasonData && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{seasonData.name}</span>
              {seasonData.air_date && <span>{new Date(seasonData.air_date).getFullYear()}</span>}
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>{seasonData.episodes?.length ?? seasonData.episode_count} episodes</span>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <TvEpisodeList
              episodes={seasonData?.episodes ?? []}
              loading={seasonLoading}
              onPlayEpisode={playEpisode}
            />
          </div>
        </div>

        <TvCast cast={show.credits?.cast ?? []} />
      </div>

      {episodePlayer && (
        <TvEpisodePlayerModal
          url={episodePlayer.url}
          title={episodePlayer.title}
          onClose={() => setEpisodePlayer(null)}
        />
      )}
    </div>
  );
}