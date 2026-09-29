export default function MovieDetailsSkeleton() {
  return (
    <div className="container-page animate-pulse py-8" aria-busy="true" aria-label="Loading movie details">
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <div className="aspect-[2/3] w-44 shrink-0 rounded-xl bg-slate-200 dark:bg-ink-800 md:w-72" />
        <div className="w-full flex-1 space-y-3">
          <div className="h-10 w-3/5 rounded bg-slate-200 dark:bg-ink-800" />
          <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-ink-800" />
          <div className="mt-6 h-4 rounded bg-slate-200 dark:bg-ink-800" />
          <div className="h-4 rounded bg-slate-200 dark:bg-ink-800" />
          <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-ink-800" />
        </div>
      </div>
    </div>
  );
}
