/** TMDB's terms require this attribution notice. */
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500 dark:border-ink-700 dark:text-slate-400">
      This product uses the TMDB API but is not endorsed or certified by{' '}
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold underline underline-offset-2"
      >
        TMDB
      </a>
      .
    </footer>
  );
}
