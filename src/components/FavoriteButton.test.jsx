import { fireEvent, screen } from '@testing-library/react';
import { loggedIn, renderWithProviders } from '../test-utils';
import FavoriteButton from './FavoriteButton';

const dune = { id: 1, title: 'Dune', poster_path: null, release_date: '2021-10-22', vote_average: 8 };

test('toggles its pressed state and updates the store', () => {
  const { store } = renderWithProviders(<FavoriteButton movie={dune} />, { preloadedState: loggedIn });
  const button = screen.getByRole('button', { name: 'Favorite Dune' });

  expect(button).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(store.getState().favorites.byUser.demo[1].title).toBe('Dune');

  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'false');
});
