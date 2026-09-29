import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '../test-utils';
import LoginPage from './LoginPage';

const fill = (username, password) => {
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: username } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
};

const renderLogin = () =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<p>Home screen</p>} />
    </Routes>,
    { route: '/login' }
  );

test('shows field errors and does not submit invalid input', () => {
  const { store } = renderLogin();
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(screen.getByText('Enter your username.')).toBeInTheDocument();
  expect(store.getState().auth.status).toBe('idle');
});

test('rejects bad credentials, then accepts the demo account and redirects', async () => {
  renderLogin();
  fill('demo', 'wrong-password');
  // The mock API waits 600ms, so findBy (which retries) is the right query.
  expect(await screen.findByText('Invalid username or password.', {}, { timeout: 3000 })).toBeInTheDocument();
  fill('demo', 'movie123');
  expect(await screen.findByText('Home screen', {}, { timeout: 3000 })).toBeInTheDocument();
});
