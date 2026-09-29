import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieGrid from '../components/MovieGrid';
import { selectFavoritesList } from '../features/favorites/favoritesSlice';

export default function FavoritesPage() {
  const favorites = useSelector(selectFavoritesList);

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="heading">My favorites</h1>

      {favorites.length === 0 ? (
        // An empty state explains and offers the next step.
        <div className="py-16 text-center">
          <FavoriteBorderIcon sx={{ fontSize: 64 }} className="text-slate-400" aria-hidden />
          <p className="mt-2 font-display text-xl font-bold">No favorites yet</p>
          <p className="mb-5 mt-1 text-slate-600 dark:text-slate-400">
            Tap the heart on any movie to save it here.
          </p>
          <Link to="/" className="btn btn-primary">Discover movies</Link>
        </div>
      ) : (
        <>
          <p className="mb-6 mt-1 text-sm text-slate-600 dark:text-slate-400">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
          </p>
          <MovieGrid movies={favorites} />
        </>
      )}
    </div>
  );
}
