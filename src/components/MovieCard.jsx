import { memo } from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import FavoriteButton from './FavoriteButton';
import { posterUrl } from '../utils/image';
import { formatRating, getYear } from '../utils/format';

/**
 * Presentational card: knows nothing about the API. Memoized so appending movies
 * doesn't re-render existing cards. The heart is a SIBLING of the link, never a
 * child: interactive elements can't nest (invalid HTML, breaks keyboard/a11y).
 */
function MovieCard({ movie }) {
  const { id, title, poster_path, release_date, vote_average } = movie;

  return (
    <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-lg dark:bg-ink-900 dark:ring-ink-700">
      <Link
        to={`/movie/${id}`}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {/* aspect ratio reserves space before the image loads: no layout shift */}
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-200 dark:bg-ink-800">
          <img
            src={posterUrl(poster_path)}
            alt={`${title} poster`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink-950/80 px-2 py-0.5 text-xs font-bold text-white">
            <StarIcon sx={{ fontSize: 14 }} className="text-brand" aria-hidden />
            {formatRating(vote_average)}
          </span>
        </div>
        <div className="p-3">
          <h3 className="truncate text-sm font-bold" title={title}>{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{getYear(release_date)}</p>
        </div>
      </Link>
      <FavoriteButton movie={movie} className="absolute left-2 top-2" />
    </article>
  );
}

export default memo(MovieCard);
