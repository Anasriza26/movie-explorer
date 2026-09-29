export const DEFAULT_SORT = 'popularity.desc';
export const MIN_YEAR = 1900;
export const MAX_PAGES = 500; // TMDB refuses pages beyond 500

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most popular' },
  { value: 'vote_average.desc', label: 'Highest rated' },
  { value: 'primary_release_date.desc', label: 'Newest first' },
  { value: 'primary_release_date.asc', label: 'Oldest first' },
];
const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

/** genre/year stay strings (they are <select> values); rating is a number. */
export const DEFAULT_FILTERS = { genre: '', year: '', rating: 0, sort: DEFAULT_SORT };

const intInRange = (raw, min, max) => {
  if (!/^\d{1,4}$/.test(raw ?? '')) return null;
  const n = Number(raw);
  return n >= min && n <= max ? n : null;
};

/** URL -> valid filters. Anything invalid silently falls back to its default. */
export const parseFilters = (params, now = new Date()) => {
  const rawGenre = params.get('genre') ?? '';
  const year = intInRange(params.get('year'), MIN_YEAR, now.getFullYear() + 1);
  const rating = intInRange(params.get('rating'), 1, 9);
  const sort = params.get('sort');
  return {
    genre: /^\d{1,7}$/.test(rawGenre) && Number(rawGenre) > 0 ? String(Number(rawGenre)) : '',
    year: year ? String(year) : '',
    rating: rating ?? 0,
    sort: SORT_VALUES.includes(sort) ? sort : DEFAULT_SORT,
  };
};

/** Filters -> URL params. Defaults are omitted and the order is fixed. */
export const filtersToParams = (f) => {
  const p = new URLSearchParams();
  if (f.genre) p.set('genre', f.genre);
  if (f.year) p.set('year', f.year);
  if (f.rating > 0) p.set('rating', String(f.rating));
  if (f.sort !== DEFAULT_SORT) p.set('sort', f.sort);
  return p;
};

/** Canonical string = the identity of a filter combination (cache/race key). */
export const filtersKey = (f) => filtersToParams(f).toString();

export const hasActiveFilters = (f) => Boolean(f.genre || f.year || f.rating > 0);

/** Filters -> TMDB /discover/movie query params. */
export const buildDiscoverParams = (f, page, now = new Date()) => {
  const params = { page, include_adult: false, sort_by: f.sort };
  if (f.genre) params.with_genres = f.genre;
  if (f.year) params.primary_release_year = f.year;
  if (f.rating > 0) params['vote_average.gte'] = f.rating;

  // A 9.5 average from 3 votes is noise, so require a minimum vote count.
  if (f.rating > 0 || f.sort === 'vote_average.desc' || f.sort === 'primary_release_date.asc') {
    params['vote_count.gte'] = 100;
  }
  // "Newest first" would otherwise start with unreleased titles that have no poster.
  if (f.sort === 'primary_release_date.desc') {
    params['primary_release_date.lte'] = now.toISOString().slice(0, 10);
  }
  return params;
};
