import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchMovies } from '../../api/tmdb';
import { pickMovie } from '../../utils/movie';

export const fetchSearchPage = createAsyncThunk(
  'search/fetchPage',
  async ({ query, page }, { rejectWithValue, signal }) => {
    try {
      return await searchMovies(query, page, signal);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Page 1 always runs (brand-new search). Later pages must be the NEXT page of the
    // CURRENT query and never overlap a running request: double scroll events are harmless.
    condition: ({ query, page }, { getState }) => {
      if (page === 1) return true;
      const s = getState().search;
      return s.status !== 'loading' && query === s.query && page === s.page + 1;
    },
  }
);

const emptyResults = {
  query: '', items: [], page: 0, totalPages: 0, totalResults: 0, status: 'idle', error: null,
};

// Exported so the store can build a valid preloaded slice.
export const initialState = { ...emptyResults, lastQuery: '' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /** Start a new search: wipe results but keep `lastQuery`. */
    setQuery(state, { payload }) {
      Object.assign(state, emptyResults, { query: payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchPage.pending, (state, { meta }) => {
        if (meta.arg.query !== state.query) return; // stale
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSearchPage.fulfilled, (state, { payload, meta }) => {
        if (meta.arg.query !== state.query) return; // stale response: ignore

        const seen = new Set(state.items.map((m) => m.id));
        payload.results.forEach((m) => {
          if (!seen.has(m.id)) state.items.push(pickMovie(m));
        });
        state.page = payload.page;
        state.totalPages = payload.total_pages;
        state.totalResults = payload.total_results;
        state.status = 'succeeded';

        // Remember only searches that actually found something.
        if (payload.page === 1 && payload.results.length > 0) state.lastQuery = meta.arg.query;
      })
      .addCase(fetchSearchPage.rejected, (state, { payload, error, meta }) => {
        // An abort is us cancelling on purpose, not a failure to show the user.
        if (meta.aborted || meta.arg.query !== state.query) return;
        state.status = 'failed';
        state.error = payload || error.message;
      });
  },
});

export const { setQuery } = searchSlice.actions;
export const selectSearch = (state) => state.search;
export const selectLastQuery = (state) => state.search.lastQuery;
export default searchSlice.reducer;
