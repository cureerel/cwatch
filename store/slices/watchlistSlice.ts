import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WatchlistItem, MediaType } from "@/types";

interface WatchlistState {
  items: WatchlistItem[];
}

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: { items: [] } as WatchlistState,
  reducers: {
    addToWatchlist(state, action: PayloadAction<WatchlistItem>) {
      const exists = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.media_type === action.payload.media_type,
      );
      if (!exists) state.items.unshift(action.payload);
    },
    removeFromWatchlist(
      state,
      action: PayloadAction<{ id: number; media_type: MediaType }>,
    ) {
      state.items = state.items.filter(
        (i) =>
          !(
            i.id === action.payload.id &&
            i.media_type === action.payload.media_type
          ),
      );
    },
    clearWatchlist(state) {
      state.items = [];
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, clearWatchlist } =
  watchlistSlice.actions;
export default watchlistSlice.reducer;
