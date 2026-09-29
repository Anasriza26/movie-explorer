import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

// Variables used inside jest.mock factories must start with "mock".
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear(); // CRA resets mocks anyway, but explicit is clearer
  jest.useFakeTimers();
});
afterEach(() => jest.useRealTimers());

test('navigates once, 500ms after the LAST keystroke', () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SearchBar /></MemoryRouter>);
  const input = screen.getByRole('searchbox', { name: /search movies/i });

  fireEvent.change(input, { target: { value: 'bat' } });
  fireEvent.change(input, { target: { value: 'batman' } });

  act(() => { jest.advanceTimersByTime(499); });
  expect(mockNavigate).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(1); });
  expect(mockNavigate).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith('/search?q=batman', { replace: false });
});

test('Enter searches immediately and cancels the pending debounce', () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><SearchBar /></MemoryRouter>);
  const input = screen.getByRole('searchbox', { name: /search movies/i });

  fireEvent.change(input, { target: { value: 'dune' } });
  fireEvent.submit(input.closest('form'));
  expect(mockNavigate).toHaveBeenCalledWith('/search?q=dune', { replace: false });

  act(() => { jest.advanceTimersByTime(1000); });
  expect(mockNavigate).toHaveBeenCalledTimes(1);
});
