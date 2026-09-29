import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovieDetails } from '../../api/tmdb';
import { pickDetails } from '../../utils/movie';

export const fetchMovieDetails = createAsyncThunk(
  'details/fetch',
  async (id, { rejectWithValue }) => {
    try {
      return pickDetails(await getMovieDetails(id)); // trim BEFORE it enters Redux
    } catch (err) {
      return rejectWithValue({ message: err.message, notFound: err.status === 404 });
    }
  },
  {
    // Fetch only if we have nothing yet, or the last attempt failed (= retry).
    condition: (id, { getState }) => {
      const entry = getState().details.entries[id];
      return !entry || entry.status === 'failed';
    },
  }
);

// Cached per movie id: reopening is instant, and a slow response for movie A can
// never overwrite movie B (each response writes only its own key).
const detailsSlice = createSlice({
  name: 'details',
  initialState: { entries: {} }, // { [id]: { status, data, error, notFound } }
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovieDetails.pending, (state, { meta }) => {
        state.entries[meta.arg] = { status: 'loading', data: null, error: null, notFound: false };
      })
      .addCase(fetchMovieDetails.fulfilled, (state, { payload, meta }) => {
        state.entries[meta.arg] = { status: 'succeeded', data: payload, error: null, notFound: false };
      })
      .addCase(fetchMovieDetails.rejected, (state, { payload, error, meta }) => {
        state.entries[meta.arg] = {
          status: 'failed',
          data: null,
          error: payload?.message ?? error.message,
          notFound: Boolean(payload?.notFound),
        };
      });
  },
});

export const selectDetailsEntry = (state, id) => state.details.entries[id];
export default detailsSlice.reducer;
