import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const Bomb = ({ explode }) => {
  if (explode) throw new Error('boom');
  return <p>All good</p>;
};

// React logs caught errors to console.error, which would flood test output.
beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('shows a fallback instead of crashing', () => {
  render(<ErrorBoundary resetKey="/a"><Bomb explode /></ErrorBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
});

test('recovers when the resetKey changes (user navigated away)', () => {
  const { rerender } = render(<ErrorBoundary resetKey="/a"><Bomb explode /></ErrorBoundary>);
  rerender(<ErrorBoundary resetKey="/b"><Bomb explode={false} /></ErrorBoundary>);
  expect(screen.getByText('All good')).toBeInTheDocument();
});
