import { createSelector, createSlice } from '@reduxjs/toolkit';
import { selectUsername } from '../auth/authSlice';
import { pickMovie } from '../../utils/movie';

// Usernames become object keys; "__proto__", "constructor"... exist on Object.prototype
// and cause subtle bugs. (A real backend would key by a numeric/uuid user id.)
const isUnsafeKey = (key) => key in Object.prototype;

const favoritesSlice = createSlice({
  name: 'favorites',
  // { byUser: { [username]: { [movieId]: { ...pickMovie fields, addedAt } } } }
  initialState: { byUser: {} },
  reducers: {
    toggleFavorite: {
      reducer(state, { payload: { username, movie, addedAt } }) {
        if (!username || isUnsafeKey(username)) return;

        const list = (state.byUser[username] ??= {});
        if (list[movie.id]) delete list[movie.id];
        else list[movie.id] = { ...movie, addedAt };

        if (Object.keys(list).length === 0) delete state.byUser[username]; // no empty leftovers
      },
      // Impure work (the clock) lives in `prepare`, so the reducer stays pure/testable.
      prepare(username, movie) {
        return { payload: { username, movie: pickMovie(movie), addedAt: Date.now() } };
      },
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// ---------- Selectors ----------
export const selectIsFavorite = (state, id) => {
  const username = selectUsername(state);
  return Boolean(username && state.favorites.byUser[username]?.[id]);
};

const selectByUser = (state) => state.favorites.byUser;

/** Newest first. Memoized: same array until inputs change. */
export const selectFavoritesList = createSelector([selectByUser, selectUsername], (byUser, username) =>
  Object.values((username && byUser[username]) || {}).sort(
    (a, b) => b.addedAt - a.addedAt || b.id - a.id // id breaks ties deterministically
  )
);

export const selectFavoritesCount = (state) => {
  const username = selectUsername(state);
  return username ? Object.keys(state.favorites.byUser[username] ?? {}).length : 0;
};

// ---------- Hydration (localStorage is untrusted) ----------
const cleanMovie = (m) => {
  if (!m || typeof m !== 'object') return null;
  if (!Number.isInteger(m.id) || m.id <= 0 || typeof m.title !== 'string') return null; // unfixable
  return {
    id: m.id,
    title: m.title,
    poster_path: typeof m.poster_path === 'string' ? m.poster_path : null,
    release_date: typeof m.release_date === 'string' ? m.release_date : '',
    vote_average: Number.isFinite(m.vote_average) ? m.vote_average : 0,
    addedAt: Number.isFinite(m.addedAt) ? m.addedAt : 0,
  };
};

/** Whatever came out of localStorage -> a guaranteed-valid `byUser`. Never throws. */
export const sanitizeFavorites = (raw) => {
  const byUser = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return byUser;

  Object.entries(raw).forEach(([username, entries]) => {
    if (!username || isUnsafeKey(username) || !entries || typeof entries !== 'object') return;
    const clean = {};
    Object.values(entries).forEach((entry) => {
      const movie = cleanMovie(entry);
      if (movie) clean[movie.id] = movie; // key from the validated id, not the stored key
    });
    if (Object.keys(clean).length > 0) byUser[username] = clean;
  });
  return byUser;
};
