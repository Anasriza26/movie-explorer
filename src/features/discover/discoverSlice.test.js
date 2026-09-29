import reducer, { startDiscover, fetchDiscoverPage } from './discoverSlice';

const payload = (results, extra = {}) => ({ page: 1, total_pages: 3, total_results: 60, results, ...extra });
const arg = (key, page = 1) => ({ filters: {}, key, page });

test('ignores a response that belongs to an older filter combination', () => {
  const state = reducer(undefined, startDiscover('genre=28'));
  const next = reducer(state, fetchDiscoverPage.fulfilled(payload([{ id: 1 }]), 'r1', arg('genre=35')));
  expect(next.items).toEqual([]);
});

test('appends pages without duplicates', () => {
  let s = reducer(undefined, startDiscover(''));
  s = reducer(s, fetchDiscoverPage.fulfilled(payload([{ id: 1 }, { id: 2 }]), 'r1', arg('')));
  s = reducer(s, fetchDiscoverPage.fulfilled(payload([{ id: 2 }, { id: 3 }], { page: 2 }), 'r2', arg('', 2)));
  expect(s.items.map((m) => m.id)).toEqual([1, 2, 3]);
});

test('caps totalPages at 500 (TMDB rejects page 501+)', () => {
  let s = reducer(undefined, startDiscover(''));
  s = reducer(s, fetchDiscoverPage.fulfilled(payload([{ id: 1 }], { total_pages: 48213 }), 'r1', arg('')));
  expect(s.totalPages).toBe(500);
});

test('an aborted request is not shown as an error', () => {
  const s = reducer(undefined, startDiscover('year=2020'));
  const abort = Object.assign(new Error('Aborted'), { name: 'AbortError' });
  const next = reducer(s, fetchDiscoverPage.rejected(abort, 'r1', arg('year=2020')));
  expect(next.status).toBe('idle');
});

test('startDiscover wipes the previous results', () => {
  let s = reducer(undefined, startDiscover(''));
  s = reducer(s, fetchDiscoverPage.fulfilled(payload([{ id: 1 }]), 'r1', arg('')));
  expect(reducer(s, startDiscover('rating=8')).items).toEqual([]);
});
