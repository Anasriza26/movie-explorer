import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import { selectMode, toggleMode } from '../features/ui/uiSlice';
import { logout, selectUser } from '../features/auth/authSlice';
import { selectFavoritesCount } from '../features/favorites/favoritesSlice';
import SearchBar from './SearchBar';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const favCount = useSelector(selectFavoritesCount);
  const isDark = useSelector(selectMode) === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);

  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const handleLogout = () => {
    setAnchorEl(null);
    // ORDER MATTERS: navigate first. Clearing the user first would make ProtectedRoute
    // redirect with `from`, sending the NEXT person who signs in to this user's last page.
    navigate('/login', { replace: true });
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-ink-700 dark:bg-ink-950/85">
      <div className="container-page flex h-16 items-center gap-1.5 sm:gap-3">
        <Link
          to="/"
          aria-label="Movie Explorer home"
          className="mr-auto flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <MovieIcon color="primary" />
          <span className="hidden font-display text-lg font-extrabold tracking-tight sm:inline">
            Movie Explorer
          </span>
        </Link>

        {user && <SearchBar />}

        {user && (
          <Link to="/discover" aria-label="Discover movies with filters" title="Discover" className="icon-btn hidden sm:inline-flex">
            <TuneIcon />
          </Link>
        )}

        {user && (
          <Link to="/favorites" aria-label={`Favorites, ${favCount} saved`} title="Favorites" className="icon-btn">
            <FavoriteIcon />
            {favCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-brand px-1 text-center text-[11px] font-bold leading-[18px] text-ink-950">
                {favCount > 99 ? '99+' : favCount}
              </span>
            )}
          </Link>
        )}

        <button
          type="button"
          onClick={() => dispatch(toggleMode())}
          aria-label={themeLabel}
          title={themeLabel}
          className="icon-btn"
        >
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

        {user && (
          <>
            <button
              type="button"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={Boolean(anchorEl)}
              className="icon-btn !h-9 !w-9 !bg-brand font-bold text-ink-950 hover:!bg-brand-dark"
            >
              {user.username.charAt(0).toUpperCase()}
            </button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <div className="px-4 py-2">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-bold">{user.username}</p>
              </div>
              <Divider />
              {/* On phones the Discover icon is hidden to save space, so it lives here */}
              <MenuItem
                className="sm:!hidden"
                onClick={() => { setAnchorEl(null); navigate('/discover'); }}
              >
                <ListItemIcon><TuneIcon fontSize="small" /></ListItemIcon>
                Discover
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Log out
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
    </header>
  );
}
