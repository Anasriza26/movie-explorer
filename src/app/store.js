import { configureStore } from '@reduxjs/toolkit';
import trendingReducer from '../features/trending/trendingSlice';
import uiReducer from '../features/ui/uiSlice';
import searchReducer, { initialState as searchInitialState } from '../features/search/searchSlice';
import authReducer, { initialState as authInitialState } from '../features/auth/authSlice';
import detailsReducer from '../features/details/detailsSlice';
import favoritesReducer, { sanitizeFavorites } from '../features/favorites/favoritesSlice';
import genresReducer from '../features/genres/genresSlice';
import discoverReducer from '../features/discover/discoverSlice';
import { loadState, saveState } from './persist';

// What survives a refresh: saved-key -> how to read it from state.
const PERSISTED = {
  ui: (state) => state.ui,
  lastQuery: (state) => state.search.lastQuery,
  user: (state) => state.auth.user,
  favorites: (state) => state.favorites.byUser,
};

// --- Hydrate synchronously (so the FIRST render already knows the user) ---
// localStorage is untrusted: validate everything.
const saved = loadState();
const preloadedState = {};

if (['light', 'dark'].includes(saved?.ui?.mode)) {
  preloadedState.ui = { mode: saved.ui.mode };
}
if (typeof saved?.lastQuery === 'string' && saved.lastQuery.trim()) {
  preloadedState.search = { ...searchInitialState, lastQuery: saved.lastQuery };
}
const savedUsername = saved?.user?.username;
if (typeof savedUsername === 'string' && savedUsername.trim()) {
  preloadedState.auth = { ...authInitialState, user: { username: savedUsername } };
}
preloadedState.favorites = { byUser: sanitizeFavorites(saved?.favorites) };

export const store = configureStore({
  reducer: {
    trending: trendingReducer,
    ui: uiReducer,
    search: searchReducer,
    auth: authReducer,
    details: detailsReducer,
    favorites: favoritesReducer,
    genres: genresReducer,
    discover: discoverReducer,
  },
  preloadedState,
});

// --- Persist only when a persisted value REALLY changed ---
// Immer keeps untouched references identical, so !== is a cheap change check.
// Starting from the initial state means nothing is written on startup, so the OS
// theme preference is not frozen as if the user had chosen it.
const pickPersisted = (state) =>
  Object.fromEntries(Object.entries(PERSISTED).map(([key, select]) => [key, select(state)]));

let lastSaved = pickPersisted(store.getState());

store.subscribe(() => {
  const current = pickPersisted(store.getState());
  if (Object.keys(current).some((key) => current[key] !== lastSaved[key])) {
    lastSaved = current;
    saveState(current);
  }
});
