import type { Movie, ApiResponse, GenreListResponse } from "@/types";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? "";
const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const VIDROCK_BASE = "https://vidrock.net";

async function tmdb<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  if (params)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ── Image helpers ──────────────────────────────────────────────────────────
export function getPosterUrl(
  path: string | null,
  size: "w342" | "w500" | "w780" | "original" = "w500",
): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280",
): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getTitle(movie: Movie): string {
  return movie.title ?? movie.name ?? "Untitled";
}

export function getReleaseYear(movie: Movie): string {
  const date = movie.release_date ?? movie.first_air_date ?? "";
  return date ? new Date(date).getFullYear().toString() : "—";
}

// ── TMDB Endpoints ─────────────────────────────────────────────────────────
export const getTrending = (
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week",
) => tmdb<ApiResponse<Movie>>(`/trending/${mediaType}/${timeWindow}`);

export const getNowPlaying = () =>
  tmdb<ApiResponse<Movie>>("/movie/now_playing");

export const getTopRated = (mediaType: "movie" | "tv" = "movie") =>
  tmdb<ApiResponse<Movie>>(`/${mediaType}/top_rated`);

export const getPopular = (mediaType: "movie" | "tv" = "movie") =>
  tmdb<ApiResponse<Movie>>(`/${mediaType}/popular`);

export const getUpcoming = () => tmdb<ApiResponse<Movie>>("/movie/upcoming");

export const getMovieDetails = (id: number) =>
  tmdb<Movie>(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
  });

export const getTvDetails = (id: number) =>
  tmdb<Movie>(`/tv/${id}`, {
    append_to_response: "credits,videos,similar,seasons",
  });

export const searchMulti = (query: string, page = 1) =>
  tmdb<ApiResponse<Movie>>("/search/multi", {
    query,
    page: String(page),
    include_adult: "false",
  });

export const getGenres = (mediaType: "movie" | "tv" = "movie") =>
  tmdb<GenreListResponse>(`/genre/${mediaType}/list`);

export const discoverByGenre = (
  mediaType: "movie" | "tv" = "movie",
  genreId: number,
  page = 1,
) =>
  tmdb<ApiResponse<Movie>>(`/discover/${mediaType}`, {
    with_genres: String(genreId),
    page: String(page),
    sort_by: "popularity.desc",
  });

// ── VidRock embed URLs (no API key needed) ─────────────────────────────────
// Docs: https://vidrock.net
export const getMovieEmbedUrl = (tmdbId: number) =>
  `${VIDROCK_BASE}/movie/${tmdbId}`;

export const getTvEmbedUrl = (tmdbId: number, season = 1, episode = 1) =>
  `${VIDROCK_BASE}/tv/${tmdbId}/${season}/${episode}`;

// ── VidRock content lists (all available titles) ───────────────────────────
export interface VidRockItem {
  id: string; // tmdb id as string
  imdb_id?: string;
}

export async function getVidRockMovieList(): Promise<VidRockItem[]> {
  try {
    const res = await fetch(`${VIDROCK_BASE}/list/movie.json`, {
      next: { revalidate: 86400 }, // cache 24h
    });
    if (!res.ok) return [];
    return res.json() as Promise<VidRockItem[]>;
  } catch {
    return [];
  }
}

export async function getVidRockTvList(): Promise<VidRockItem[]> {
  try {
    const res = await fetch(`${VIDROCK_BASE}/list/tv.json`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<VidRockItem[]>;
  } catch {
    return [];
  }
}

export async function getSeasonDetails(tvId: number, seasonNumber: number) {
  const url = new URL(`${TMDB_BASE}/tv/${tvId}/season/${seasonNumber}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok)
    throw new Error(`TMDB error ${res.status}: season ${seasonNumber}`);
  return res.json();
}