import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import { fetchGenres, selectGenres } from '../features/genres/genresSlice';
import { fetchDiscoverPage, selectDiscover, startDiscover } from '../features/discover/discoverSlice';
import { filtersKey, filtersToParams, parseFilters } from '../utils/filters';

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const genres = useSelector(selectGenres);
  const discover = useSelector(selectDiscover);

  const filters = useMemo(() => parseFilters(params), [params]);
  const key = filtersKey(filters); // canonical string: "" means no filters

  useEffect(() => {
    dispatch(fetchGenres()); // no-op after the first success
  }, [dispatch]);

  // Restart whenever the canonical filter STRING changes (a string can't cause an
  // endless loop the way an object dependency can). Cleanup aborts the old request.
  useEffect(() => {
    dispatch(startDiscover(key));
    const request = dispatch(
      fetchDiscoverPage({ filters: parseFilters(new URLSearchParams(key)), key, page: 1 })
    );
    return () => request.abort();
  }, [key, dispatch]);

  const isCurrent = discover.key === key; // never show another combination's items
  const items = isCurrent ? discover.items : [];
  const status = isCurrent ? discover.status : 'loading';
  const isLoading = status === 'idle' || status === 'loading';
  const failed = status === 'failed';
  const hasMore = isCurrent && discover.page < discover.totalPages;
  const loadingMore = isLoading && items.length > 0;

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    dispatch(fetchDiscoverPage({ filters, key, page: discover.page + 1 }));
  }, [dispatch, filters, key, discover.page, loadingMore]);

  // A failed FIRST page: restart the same combination from page 1.
  const retryFirstPage = () => {
    dispatch(startDiscover(key));
    dispatch(fetchDiscoverPage({ filters, key, page: 1 }));
  };

  const updateFilters = (patch) => setParams(filtersToParams({ ...filters, ...patch }));
  const clearFilters = () => updateFilters({ genre: '', year: '', rating: 0 });

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="heading mb-6">Discover movies</h1>

      {genres.status === 'failed' && (
        <ErrorMessage message={`Couldn't load genres. ${genres.error}`} onRetry={() => dispatch(fetchGenres())} />
      )}

      <FilterBar filters={filters} genres={genres} onChange={updateFilters} onClear={clearFilters} />

      {isCurrent && discover.totalResults > 0 && (
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          {discover.totalResults.toLocaleString()} movies match
        </p>
      )}

      {failed && items.length === 0 && <ErrorMessage message={discover.error} onRetry={retryFirstPage} />}

      {!isLoading && !failed && items.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-xl font-bold">No movies match these filters</p>
          <p className="mb-4 mt-1 text-slate-600 dark:text-slate-400">
            Try a wider year or a lower minimum rating.
          </p>
          <button type="button" onClick={clearFilters} className="btn btn-outline">Clear filters</button>
        </div>
      )}

      <MovieGrid movies={items} loading={isLoading} skeletonCount={items.length ? 6 : 12} />

      {failed && items.length > 0 && <ErrorMessage message={discover.error} onRetry={loadMore} />}

      {hasMore && !failed && (
        <div className="mt-8 text-center">
          {/* aria-disabled instead of `disabled`: a disabled button drops keyboard focus */}
          <button
            type="button"
            onClick={loadMore}
            aria-disabled={loadingMore}
            className="btn btn-outline !px-8 !py-3"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {/* Screen readers hear the outcome of a filter change or Load more */}
      <div role="status" className="sr-only">
        {isCurrent && status === 'succeeded' ? `${items.length} movies shown` : ''}
      </div>
    </div>
  );
}
