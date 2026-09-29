import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import { fetchTrending, selectTrending } from '../features/trending/trendingSlice';
import { selectLastQuery } from '../features/search/searchSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, page, totalPages, status, error } = useSelector(selectTrending);
  const lastQuery = useSelector(selectLastQuery);

  const isLoading = status === 'loading';
  const hasMore = page < totalPages;

  // First page once. The thunk's `condition` blocks duplicate requests (StrictMode-safe).
  useEffect(() => {
    if (status === 'idle') dispatch(fetchTrending(1));
  }, [status, dispatch]);

  // "Load more" and "Retry" are the same action: a failed request never advanced `page`.
  const loadNext = () => dispatch(fetchTrending(page + 1));

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading">Trending this week</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            What everyone is watching right now.
          </p>
        </div>
        {lastQuery && (
          <Link
            to={`/search?q=${encodeURIComponent(lastQuery)}`}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-200/60 dark:border-ink-600 dark:hover:bg-ink-800"
          >
            <HistoryIcon fontSize="small" aria-hidden />
            <span className="truncate">Last search: {lastQuery}</span>
          </Link>
        )}
      </div>

      {status === 'failed' && items.length === 0 && <ErrorMessage message={error} onRetry={loadNext} />}

      <MovieGrid movies={items} loading={isLoading} />

      {status === 'failed' && items.length > 0 && <ErrorMessage message={error} onRetry={loadNext} />}

      {items.length > 0 && hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button type="button" onClick={loadNext} className="btn btn-outline !px-8 !py-3">
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
