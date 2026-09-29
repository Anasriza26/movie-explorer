import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';

/**
 * Layout route: renders child routes for logged-in users, otherwise redirects to /login
 * and remembers where they were headed. A route guard is UX, NOT security: real
 * protection must happen on the server.
 */
export default function ProtectedRoute() {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    // `replace`: otherwise Back would return to the guarded page and loop.
    return <Navigate to="/login" replace state={{ from }} />;
  }
  return <Outlet />;
}
