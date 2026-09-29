import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import CastList from '../components/CastList';
import ErrorMessage from '../components/ErrorMessage';
import FavoriteButton from '../components/FavoriteButton';
import MovieDetailsSkeleton from '../components/MovieDetailsSkeleton';
import TrailerDialog from '../components/TrailerDialog';
import NotFoundPage from './NotFoundPage';
import { fetchMovieDetails, selectDetailsEntry } from '../features/details/detailsSlice';
import { backdropUrl, posterUrl } from '../utils/image';
import { formatDate, formatRating, formatRuntime, getYear } from '../utils/format';

export default function MovieDetailsPage() {
  const { id: rawId } = useParams();
  // "abc", "-1", "1e5" never reach the API; "007" is normalised to "7" (one cache entry).
  const id = /^\d{1,9}$/.test(rawId) ? String(Number(rawId)) : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const entry = useSelector((state) => selectDetailsEntry(state, id));
  const [trailerOpen, setTrailerOpen] = useState(false);

  // React Router doesn't reset scroll, so opening a movie from mid-grid would land mid-page.
  useEffect(() => {
    window.scrollTo(0, 0);
    setTrailerOpen(false);
  }, [id]);

  // The thunk's `condition` makes this a no-op when the data is cached or loading.
  useEffect(() => {
    if (id) dispatch(fetchMovieDetails(id));
  }, [id, dispatch]);

  const movie = entry?.data;
  const title = movie?.title;

  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = `${title} – Movie Explorer`;
    return () => { document.title = previous; };
  }, [title]);

  // location.key === "default" only for the first entry of a session (a pasted link),
  // where navigate(-1) would leave the app.
  const handleBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'));

  if (!id || entry?.notFound) return <NotFoundPage />;

  if (entry?.status === 'failed') {
    return (
      <div className="container-page max-w-xl py-10">
        <ErrorMessage message={entry.error} onRetry={() => dispatch(fetchMovieDetails(id))} />
        <button type="button" onClick={handleBack} className="btn btn-outline mt-2">
          <ArrowBackIcon fontSize="small" /> Back
        </button>
      </div>
    );
  }

  if (!movie) return <MovieDetailsSkeleton />;

  const backdrop = backdropUrl(movie.backdrop_path);
  const meta = [getYear(movie.release_date), formatRuntime(movie.runtime), movie.director && `Directed by ${movie.director}`]
    .filter(Boolean)
    .join('  |  ');

  return (
    <article>
      {/* Hero: white text on a dark gradient in BOTH themes, so contrast never depends on the photo. */}
      <div
        className="bg-ink-900 bg-cover bg-top text-white"
        style={
          backdrop
            ? { backgroundImage: `linear-gradient(to top, rgba(12,14,19,0.96), rgba(12,14,19,0.65)), url(${backdrop})` }
            : undefined
        }
      >
        <div className="container-page py-5 md:py-10">
          <button type="button" onClick={handleBack} className="btn btn-glass mb-5 !px-3 !py-1.5">
            <ArrowBackIcon fontSize="small" /> Back
          </button>

          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
            <img
              src={posterUrl(movie.poster_path, 'w500')}
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-44 shrink-0 rounded-xl object-cover shadow-2xl sm:w-56 md:w-72"
            />

            <div className="w-full">
              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {movie.title}{' '}
                <span className="font-semibold text-white/60">({getYear(movie.release_date)})</span>
              </h1>

              {meta && <p className="mt-2 text-white/85">{meta}</p>}
              <p className="text-sm text-white/60">{formatDate(movie.release_date)}</p>

              {movie.genres.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <li key={g.id}>
                      {/* Each genre links to the Discover page pre-filtered by it */}
                      <Link
                        to={`/discover?genre=${g.id}`}
                        className="inline-block rounded-full border border-white/40 px-3 py-0.5 text-xs font-bold hover:bg-white/15"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 flex items-center gap-1.5">
                <StarIcon className="text-brand" aria-hidden />
                <span className="text-lg font-bold">{formatRating(movie.vote_average)}</span>
                {movie.vote_count > 0 && (
                  <span className="text-sm text-white/60">({movie.vote_count.toLocaleString()} votes)</span>
                )}
              </p>

              {movie.tagline && <p className="mt-4 italic text-white/80">{movie.tagline}</p>}

              <h2 className="mt-5 font-display text-xl font-extrabold">Overview</h2>
              <p className="mt-1 max-w-2xl leading-relaxed text-white/90">
                {movie.overview || 'No overview available yet.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {movie.trailerKey ? (
                  <button type="button" onClick={() => setTrailerOpen(true)} className="btn btn-primary">
                    <PlayArrowIcon fontSize="small" /> Watch trailer
                  </button>
                ) : (
                  <span className="text-sm text-white/60">No trailer available.</span>
                )}
                <FavoriteButton movie={movie} variant="button" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <CastList cast={movie.cast} />
      </div>

      <TrailerDialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={movie.trailerKey}
        title={movie.title}
      />
    </article>
  );
}
