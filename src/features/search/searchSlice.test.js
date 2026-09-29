import reducer, { setQuery, fetchSearchPage } from './searchSlice';

const page = (results, extra = {}) => ({ page: 1, total_pages: 2, total_results: 40, results, ...extra });

describe('searchSlice', () => {
  test('ignores a stale response from an older query', () => {
    const state = reducer(undefined, setQuery('batman'));
    const next = reducer(state, fetchSearchPage.fulfilled(page([{ id: 1, title: 'Bat' }]), 'r1', { query: 'bat', page: 1 }));
    expect(next.items).toEqual([]);
  });

  test('appends pages without duplicating movies', () => {
    let state = reducer(undefined, setQuery('bat'));
    state = reducer(state, fetchSearchPage.fulfilled(page([{ id: 1 }, { id: 2 }]), 'r1', { query: 'bat', page: 1 }));
    state = reducer(state, fetchSearchPage.fulfilled(page([{ id: 2 }, { id: 3 }], { page: 2 }), 'r2', { query: 'bat', page: 2 }));
    expect(state.items.map((m) => m.id)).toEqual([1, 2, 3]);
    expect(state.page).toBe(2);
  });

  test('saves lastQuery only for a first page that has results', () => {
    let state = reducer(undefined, setQuery('asdfgh'));
    state = reducer(state, fetchSearchPage.fulfilled(page([]), 'r1', { query: 'asdfgh', page: 1 }));
    expect(state.lastQuery).toBe('');
    state = reducer(state, setQuery('batman'));
    state = reducer(state, fetchSearchPage.fulfilled(page([{ id: 1 }]), 'r2', { query: 'batman', page: 1 }));
    expect(state.lastQuery).toBe('batman');
  });

  test('setQuery clears results but keeps lastQuery', () => {
    let state = reducer(undefined, setQuery('batman'));
    state = reducer(state, fetchSearchPage.fulfilled(page([{ id: 1 }]), 'r1', { query: 'batman', page: 1 }));
    state = reducer(state, setQuery('joker'));
    expect(state.items).toEqual([]);
    expect(state.lastQuery).toBe('batman');
  });

  test('an aborted request is not treated as an error', () => {
    const state = reducer(undefined, setQuery('bat'));
    const abortError = Object.assign(new Error('Aborted'), { name: 'AbortError' });
    const next = reducer(state, fetchSearchPage.rejected(abortError, 'r1', { query: 'bat', page: 1 }));
    expect(next.status).toBe('idle');
    expect(next.error).toBeNull();
  });
});
