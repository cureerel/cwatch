import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  searchQuery: string;
  isSearchOpen: boolean;
  activeGenre: number | null;
  activeMediaType: "movie" | "tv";
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    searchQuery: "",
    isSearchOpen: false,
    activeGenre: null,
    activeMediaType: "movie",
  } as UiState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
    setActiveGenre: (state, action: PayloadAction<number | null>) => {
      state.activeGenre = action.payload;
    },
    setActiveMediaType: (state, action: PayloadAction<"movie" | "tv">) => {
      state.activeMediaType = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setSearchOpen,
  setActiveGenre,
  setActiveMediaType,
} = uiSlice.actions;
export default uiSlice.reducer;
