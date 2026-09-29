import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { discoverMovies } from '../../api/tmdb';
import { buildDiscoverParams, MAX_PAGES } from '../../utils/filters';
import { pickMovie } from '../../utils/movie';

// arg: { filters, key, page } where `key` = filtersKey(filters)
export const fetchDiscoverPage = createAsyncThunk(
  'discover/fetchPage',
  async ({ filters, page }, { rejectWithValue, signal }) => {
    try {
      return await discoverMovies(buildDiscoverParams(filters, page), signal);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    condition: ({ key, page }, { getState }) => {
      if (page === 1) return true;
      const s = getState().discover;
      return s.status !== 'loading' && key === s.key && page === s.page + 1;
    },
  }
);

const emptyResults = {
  key: null, items: [], page: 0, totalPages: 0, totalResults: 0, status: 'idle', error: null,
};

const discoverSlice = createSlice({
  name: 'discover',
  initialState: emptyResults,
  reducers: {
    startDiscover(state, { payload: key }) {
      Object.assign(state, emptyResults, { key });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscoverPage.pending, (state, { meta }) => {
        if (meta.arg.key !== state.key) return;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDiscoverPage.fulfilled, (state, { payload, meta }) => {
        if (meta.arg.key !== state.key) return; // stale response: ignore
        const seen = new Set(state.items.map((m) => m.id));
        payload.results.forEach((m) => {
          if (!seen.has(m.id)) state.items.push(pickMovie(m));
        });
        state.page = payload.page;
        state.totalPages = Math.min(payload.total_pages, MAX_PAGES);
        state.totalResults = payload.total_results;
        state.status = 'succeeded';
      })
      .addCase(fetchDiscoverPage.rejected, (state, { payload, error, meta }) => {
        if (meta.aborted || meta.arg.key !== state.key) return;
        state.status = 'failed';
        state.error = payload || error.message;
      });
  },
});

export const { startDiscover } = discoverSlice.actions;
export const selectDiscover = (state) => state.discover;
export default discoverSlice.reducer;
