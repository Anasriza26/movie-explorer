import MovieCard from './MovieCard';

// Mobile-first: 2 columns on phones, growing with the screen.
const GRID =
  'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7';

function MovieSkeleton() {
  return (
    <li aria-hidden className="animate-pulse overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 dark:bg-ink-900 dark:ring-ink-700">
      <div className="aspect-[2/3] bg-slate-200 dark:bg-ink-800" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-ink-800" />
        <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-ink-800" />
      </div>
    </li>
  );
}

/** When `loading` is true it appends skeletons, so one component handles first load and "load more". */
export default function MovieGrid({ movies, loading = false, skeletonCount = 12 }) {
  return (
    <ul className={GRID}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
      {loading && Array.from({ length: skeletonCount }, (_, i) => <MovieSkeleton key={`sk-${i}`} />)}
    </ul>
  );
}
