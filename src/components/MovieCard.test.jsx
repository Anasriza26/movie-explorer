import { screen } from '@testing-library/react';
import { loggedIn, renderWithProviders } from '../test-utils';
import MovieCard from './MovieCard';

const base = { id: 7, title: 'Dune', poster_path: null, release_date: '2021-10-22', vote_average: 8.04 };

test('shows title, year and rating, and links to the details page', () => {
  renderWithProviders(<MovieCard movie={base} />, { preloadedState: loggedIn });
  expect(screen.getByText('Dune')).toBeInTheDocument();
  expect(screen.getByText('2021')).toBeInTheDocument();
  expect(screen.getByText('8.0')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/movie/7');
});

test('shows NR for an unrated movie and TBA for a missing date', () => {
  renderWithProviders(<MovieCard movie={{ ...base, vote_average: 0, release_date: '' }} />, { preloadedState: loggedIn });
  expect(screen.getByText('NR')).toBeInTheDocument();
  expect(screen.getByText('TBA')).toBeInTheDocument();
});
