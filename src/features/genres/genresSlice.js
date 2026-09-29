import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGenres } from '../../api/tmdb';

export const fetchGenres = createAsyncThunk(
  'genres/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getGenres(); // [{ id, name }]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Fetched once per session; retry only after a failure.
    condition: (_, { getState }) => ['idle', 'failed'].includes(getState().genres.status),
  }
);

const genresSlice = createSlice({
  name: 'genres',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchGenres.fulfilled, (s, { payload }) => {
        s.items = payload.map(({ id, name }) => ({ id, name }));
        s.status = 'succeeded';
      })
      .addCase(fetchGenres.rejected, (s, { payload, error }) => {
        s.status = 'failed';
        s.error = payload || error.message;
      });
  },
});

export const selectGenres = (state) => state.genres;
export default genresSlice.reducer;
