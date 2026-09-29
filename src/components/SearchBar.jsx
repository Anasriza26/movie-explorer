import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useDebouncedCallback from '../hooks/useDebouncedCallback';

/** The URL (/search?q=...) is the source of truth; this box mirrors it. */
export default function SearchBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const inputRef = useRef(null);

  const onSearchPage = pathname === '/search';
  const urlQuery = onSearchPage ? (params.get('q') ?? '').trim() : '';
  const [value, setValue] = useState(urlQuery);

  // On /search we REPLACE the history entry, so typing "batman" doesn't leave six entries.
  const goTo = useCallback(
    (raw) => {
      const q = raw.trim();
      if (q) navigate(`/search?q=${encodeURIComponent(q)}`, { replace: onSearchPage });
      else if (onSearchPage) navigate('/', { replace: true });
    },
    [navigate, onSearchPage]
  );

  const [goToDebounced, cancelPending] = useDebouncedCallback(goTo, 500);

  // URL -> input (Back/Forward, shared links). Comparing TRIMMED values keeps a
  // trailing space alive: typing "star " must not collapse to "star" and give "starwars".
  useEffect(() => {
    setValue((current) => (current.trim() === urlQuery ? current : urlQuery));
    cancelPending();
  }, [urlQuery, cancelPending]);

  const handleChange = (e) => {
    setValue(e.target.value);
    goToDebounced(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    cancelPending(); // Enter searches immediately
    goTo(value);
  };

  const handleClear = () => {
    setValue('');
    cancelPending();
    goTo('');
    inputRef.current?.focus();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fontSize="small" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search movies"
        aria-label="Search movies"
        className="field !rounded-full !py-2 pl-10 pr-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-ink-700"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>
      )}
    </form>
  );
}
