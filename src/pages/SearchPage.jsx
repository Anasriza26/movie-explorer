import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import ErrorMessage from '../components/ErrorMessage';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchSearchPage, selectSearch, setQuery } from '../features/search/searchSlice';

export default function SearchPage() {
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const query = (params.get('q') ?? '').trim();
  const search = useSelector(selectSearch);

  // Start (or restart) whenever the URL query changes. The cleanup aborts the old
  // request (race defence layer 1) and makes StrictMode's double-run harmless.
  useEffect(() => {
    if (!query) return undefined;
    dispatch(setQuery(query));
    const request = dispatch(fetchSearchPage({ query, page: 1 }));
    return () => request.abort();
  }, [query, dispatch]);

  // Layer 3: for one render after the URL changes, Redux still holds the OLD query's items. Never show them.
  const isCurrent = search.query === query;
  const items = isCurrent ? search.items : [];
  const isLoading = !isCurrent || search.status === 'idle' || search.status === 'loading';
  const failed = isCurrent && search.status === 'failed';
  const hasMore = isCurrent && search.page < search.totalPages;

  const loadMore = useCallback(
    () => dispatch(fetchSearchPage({ query, page: search.page + 1 })),
    [dispatch, query, search.page]
  );

  // Disabled while loading or after an error, so a failure can't cause a retry loop.
  const sentinelRef = useInfiniteScroll(loadMore, isCurrent && search.status === 'succeeded' && hasMore);

  if (!query) {
    return (
      <div className="container-page py-20 text-center text-slate-600 dark:text-slate-400">
        Type a movie name in the search bar to get started.
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="heading break-words">Results for “{query}”</h1>
      {isCurrent && search.totalResults > 0 && (
        <p className="mb-6 mt-1 text-sm text-slate-600 dark:text-slate-400">
          {search.totalResults.toLocaleString()} movies found
        </p>
      )}

      {failed && items.length === 0 && <ErrorMessage message={search.error} onRetry={loadMore} />}

      {!isLoading && !failed && items.length === 0 && (
        <p className="py-16 text-center text-slate-600 dark:text-slate-400">
          No results for “{query}”. Check the spelling or try another title.
        </p>
      )}

      <div className="mt-4"><MovieGrid movies={items} loading={isLoading} /></div>

      {failed && items.length > 0 && <ErrorMessage message={search.error} onRetry={loadMore} />}

      {/* Invisible sentinel: when it nears the viewport, load the next page */}
      {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}

      {!isLoading && !hasMore && items.length > 0 && (
        <p className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          That’s everything for “{query}”.
        </p>
      )}
    </div>
  );
}
