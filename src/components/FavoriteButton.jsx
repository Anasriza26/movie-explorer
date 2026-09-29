import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { selectUsername } from '../features/auth/authSlice';
import { selectIsFavorite, toggleFavorite } from '../features/favorites/favoritesSlice';

/**
 * variant="icon"   -> round heart overlay for poster cards
 * variant="button" -> labelled button for the details hero
 *
 * a11y: the accessible name stays CONSTANT ("Favorite Dune") and aria-pressed carries
 * the on/off state; changing the label AND aria-pressed would announce the state twice.
 * Selecting a boolean means only THIS button re-renders when its answer changes.
 */
function FavoriteButton({ movie, variant = 'icon', className = '' }) {
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const isFavorite = useSelector((state) => selectIsFavorite(state, movie.id));

  const Icon = isFavorite ? FavoriteIcon : FavoriteBorderIcon;
  const heart = <Icon fontSize="small" className={isFavorite ? 'text-rose-400' : ''} />;
  const common = {
    type: 'button',
    onClick: () => dispatch(toggleFavorite(username, movie)),
    'aria-label': `Favorite ${movie.title}`,
    'aria-pressed': isFavorite,
  };

  if (variant === 'button') {
    return (
      <button {...common} className={`btn btn-glass ${className}`}>
        {heart} Favorite
      </button>
    );
  }
  return (
    <button
      {...common}
      className={`flex h-9 w-9 items-center justify-center rounded-full border-0 bg-ink-950/70 text-white backdrop-blur transition-colors hover:bg-ink-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      {heart}
    </button>
  );
}

export default memo(FavoriteButton);
