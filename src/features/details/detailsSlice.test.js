import reducer, { fetchMovieDetails } from './detailsSlice';

const empty = { entries: {} };

test('pending creates a loading entry for that id only', () => {
  const state = reducer(empty, fetchMovieDetails.pending('r1', '603'));
  expect(state.entries['603'].status).toBe('loading');
  expect(state.entries['604']).toBeUndefined();
});

test('a slow response for one movie never touches another', () => {
  let state = reducer(empty, fetchMovieDetails.pending('r1', '1'));
  state = reducer(state, fetchMovieDetails.pending('r2', '2'));
  state = reducer(state, fetchMovieDetails.fulfilled({ id: 2, title: 'Two' }, 'r2', '2'));
  state = reducer(state, fetchMovieDetails.fulfilled({ id: 1, title: 'One' }, 'r1', '1'));
  expect(state.entries['1'].data.title).toBe('One');
  expect(state.entries['2'].data.title).toBe('Two');
});

test('a 404 is flagged so the page can show Not Found', () => {
  const state = reducer(empty, fetchMovieDetails.rejected(null, 'r1', '999', { message: 'Not found', notFound: true }));
  expect(state.entries['999']).toMatchObject({ status: 'failed', notFound: true, error: 'Not found' });
});

test('a network failure is NOT flagged as not found', () => {
  const state = reducer(empty, fetchMovieDetails.rejected(null, 'r1', '5', { message: 'Network error.', notFound: false }));
  expect(state.entries['5'].notFound).toBe(false);
});
