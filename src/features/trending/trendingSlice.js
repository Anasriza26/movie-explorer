import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrending } from '../../api/tmdb';
import { pickMovie } from '../../utils/movie';

export const fetchTrending = createAsyncThunk(
  'trending/fetchPage',
  async (page = 1, { rejectWithValue, signal }) => {
    try {
      return await getTrending(page, signal);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Skip if a request is already in flight (also covers StrictMode's double effect).
    condition: (_, { getState }) => getState().trending.status !== 'loading',
  }
);

const trendingSlice = createSlice({
  name: 'trending',
  initialState: { items: [], page: 0, totalPages: 0, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrending.fulfilled, (state, { payload }) => {
        // TMDB can repeat a movie across pages; duplicate React keys cause bugs.
        const seen = new Set(state.items.map((m) => m.id));
        payload.results.forEach((m) => {
          if (!seen.has(m.id)) state.items.push(pickMovie(m));
        });
        state.page = payload.page; // only advances on success, so retry = request page + 1 again
        state.totalPages = payload.total_pages;
        state.status = 'succeeded';
      })
      .addCase(fetchTrending.rejected, (state, { payload, error }) => {
        state.status = 'failed';
        state.error = payload || error.message;
      });
  },
});

export const selectTrending = (state) => state.trending;
export default trendingSlice.reducer;
