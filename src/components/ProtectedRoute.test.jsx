import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { loggedIn, renderWithProviders } from '../test-utils';
import ProtectedRoute from './ProtectedRoute';

const renderAt = (preloadedState) =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Login screen</p>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/secret" element={<p>Secret content</p>} />
      </Route>
    </Routes>,
    { route: '/secret', preloadedState }
  );

test('redirects anonymous visitors to /login', () => {
  renderAt(undefined);
  expect(screen.getByText('Login screen')).toBeInTheDocument();
  expect(screen.queryByText('Secret content')).not.toBeInTheDocument();
});

test('renders the page for a logged-in user', () => {
  renderAt(loggedIn);
  expect(screen.getByText('Secret content')).toBeInTheDocument();
});
