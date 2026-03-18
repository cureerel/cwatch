"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/store/slices/watchlistSlice";
import type { Movie, MediaType, WatchlistItem } from "@/types";
import { getTitle } from "@/lib/api";

export function useWatchlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.watchlist.items);

  function isInWatchlist(id: number, media_type: MediaType) {
    return items.some((i) => i.id === id && i.media_type === media_type);
  }

  function toggle(movie: Movie, media_type: MediaType) {
    if (isInWatchlist(movie.id, media_type)) {
      dispatch(removeFromWatchlist({ id: movie.id, media_type }));
    } else {
      const item: WatchlistItem = {
        id: movie.id,
        title: getTitle(movie),
        poster_path: movie.poster_path,
        media_type,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      };
      dispatch(addToWatchlist(item));
    }
  }

  return { items, isInWatchlist, toggle };
}
