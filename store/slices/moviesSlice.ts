import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie, Genre } from "@/types";

interface MoviesState {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
  genres: Genre[];
  searchResults: Movie[];
  isLoading: boolean;
  error: string | null;
}

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    trending: [],
    popular: [],
    topRated: [],
    nowPlaying: [],
    genres: [],
    searchResults: [],
    isLoading: false,
    error: null,
  } as MoviesState,
  reducers: {
    setTrending: (state, action: PayloadAction<Movie[]>) => {
      state.trending = action.payload;
    },
    setPopular: (state, action: PayloadAction<Movie[]>) => {
      state.popular = action.payload;
    },
    setTopRated: (state, action: PayloadAction<Movie[]>) => {
      state.topRated = action.payload;
    },
    setNowPlaying: (state, action: PayloadAction<Movie[]>) => {
      state.nowPlaying = action.payload;
    },
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Movie[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTrending,
  setPopular,
  setTopRated,
  setNowPlaying,
  setGenres,
  setSearchResults,
  setLoading,
  setError,
} = moviesSlice.actions;
export default moviesSlice.reducer;
