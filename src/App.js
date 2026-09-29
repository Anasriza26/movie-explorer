import { lazy, Suspense, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { buildTheme } from './app/theme';
import { selectMode } from './features/ui/uiSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

// Code splitting: visitors download only the page they open.
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" className="flex justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-brand dark:border-ink-600 dark:border-t-brand" />
    </div>
  );
}

export default function App() {
  const mode = useSelector(selectMode);
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const { pathname } = useLocation();

  // Tailwind's dark variants key off <html class="dark">. (public/index.html sets it
  // before first paint; this keeps it in sync when the user toggles.)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <div className="flex min-h-screen flex-col">
        {/* Navbar sits OUTSIDE the boundary: even on a crashed page users can navigate away */}
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary resetKey={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
