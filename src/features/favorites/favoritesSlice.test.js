import reducer, {
  toggleFavorite, sanitizeFavorites, selectFavoritesList, selectFavoritesCount, selectIsFavorite,
} from './favoritesSlice';

const movie = (id, extra = {}) => ({
  id, title: `Movie ${id}`, poster_path: '/p.jpg', release_date: '2020-01-01', vote_average: 7.5, ...extra,
});
const empty = { byUser: {} };
const stateFor = (favorites, username) => ({ favorites, auth: { user: username ? { username } : null } });

// Created in beforeEach: CRA's Jest config has resetMocks: true, which wipes module-level mocks.
let clock;
beforeEach(() => {
  clock = 0;
  jest.spyOn(Date, 'now').mockImplementation(() => ++clock);
});
afterEach(() => jest.restoreAllMocks());

describe('toggleFavorite', () => {
  test('adds, then removes on the second toggle', () => {
    let s = reducer(empty, toggleFavorite('demo', movie(1)));
    expect(s.byUser.demo[1].title).toBe('Movie 1');
    s = reducer(s, toggleFavorite('demo', movie(1)));
    expect(s.byUser).toEqual({});
  });

  test('keeps each user’s favorites separate', () => {
    let s = reducer(empty, toggleFavorite('ann', movie(1)));
    s = reducer(s, toggleFavorite('bob', movie(2)));
    expect(selectIsFavorite(stateFor(s, 'ann'), 1)).toBe(true);
    expect(selectIsFavorite(stateFor(s, 'ann'), 2)).toBe(false);
    expect(selectIsFavorite(stateFor(s, 'bob'), 1)).toBe(false);
    expect(selectFavoritesCount(stateFor(s, 'bob'))).toBe(1);
  });

  test('does nothing without a user, or with an unsafe username', () => {
    expect(reducer(empty, toggleFavorite(undefined, movie(1)))).toEqual(empty);
    expect(reducer(empty, toggleFavorite('__proto__', movie(1)))).toEqual(empty);
    expect(reducer(empty, toggleFavorite('constructor', movie(1)))).toEqual(empty);
  });

  test('prepare keeps only the fields we render', () => {
    const { payload } = toggleFavorite('demo', movie(1, { overview: 'huge', credits: {} }));
    expect(Object.keys(payload.movie).sort()).toEqual(['id', 'poster_path', 'release_date', 'title', 'vote_average']);
  });
});

describe('selectors', () => {
  test('list is newest-first even though JS orders numeric keys ascending', () => {
    let s = reducer(empty, toggleFavorite('demo', movie(500)));
    s = reducer(s, toggleFavorite('demo', movie(3)));
    s = reducer(s, toggleFavorite('demo', movie(42)));
    expect(selectFavoritesList(stateFor(s, 'demo')).map((m) => m.id)).toEqual([42, 3, 500]);
  });

  test('a logged-out state sees nothing', () => {
    const s = reducer(empty, toggleFavorite('demo', movie(1)));
    const out = stateFor(s, null);
    expect(selectFavoritesList(out)).toEqual([]);
    expect(selectIsFavorite(out, 1)).toBe(false);
    expect(selectFavoritesCount(out)).toBe(0);
  });

  test('the list selector is memoized', () => {
    const state = stateFor(reducer(empty, toggleFavorite('demo', movie(1))), 'demo');
    expect(selectFavoritesList(state)).toBe(selectFavoritesList(state));
  });
});

describe('sanitizeFavorites', () => {
  test('drops unfixable entries and repairs fixable ones', () => {
    const raw = { demo: { 1: { ...movie(1), addedAt: 5 }, 2: 'junk', 3: { id: 'x', title: 'Bad id' }, 4: { id: 4, title: 'Bare minimum' } } };
    const clean = sanitizeFavorites(raw);
    expect(Object.keys(clean.demo)).toEqual(['1', '4']);
    expect(clean.demo[4]).toEqual({ id: 4, title: 'Bare minimum', poster_path: null, release_date: '', vote_average: 0, addedAt: 0 });
  });

  test('strips unknown fields', () => {
    const clean = sanitizeFavorites({ demo: { 1: { ...movie(1), evil: '<script>' } } });
    expect(clean.demo[1]).not.toHaveProperty('evil');
  });

  test.each([null, undefined, 42, 'text', []])('survives garbage input: %p', (bad) => {
    expect(sanitizeFavorites(bad)).toEqual({});
  });

  test('refuses a __proto__ username without polluting anything', () => {
    const raw = JSON.parse('{"__proto__":{"1":{"id":1,"title":"x"}}}');
    const clean = sanitizeFavorites(raw);
    expect(Object.keys(clean)).toEqual([]);
    expect(Object.getPrototypeOf(clean)).toBe(Object.prototype);
  });
});
