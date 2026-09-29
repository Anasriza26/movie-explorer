import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import trending from './features/trending/trendingSlice';
import ui from './features/ui/uiSlice';
import search from './features/search/searchSlice';
import auth from './features/auth/authSlice';
import details from './features/details/detailsSlice';
import favorites from './features/favorites/favoritesSlice';
import genres from './features/genres/genresSlice';
import discover from './features/discover/discoverSlice';

export const loggedIn = { auth: { user: { username: 'demo' }, status: 'idle', error: null } };

/** Renders with a REAL store (no Redux mocking) and a router. */
export function renderWithProviders(element, { preloadedState, route = '/' } = {}) {
  const store = configureStore({
    reducer: { trending, ui, search, auth, details, favorites, genres, discover },
    preloadedState,
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{element}</MemoryRouter>
      </Provider>
    ),
  };
}
