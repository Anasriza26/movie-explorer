import { loadState, saveState } from './persist';

const KEY = 'movie-explorer:v1';
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

describe('loadState', () => {
  test('returns the saved object', () => {
    localStorage.setItem(KEY, JSON.stringify({ ui: { mode: 'dark' } }));
    expect(loadState()).toEqual({ ui: { mode: 'dark' } });
  });
  test.each(['not json', 'null', '42', '"text"'])('returns undefined for %s', (raw) => {
    localStorage.setItem(KEY, raw);
    expect(loadState()).toBeUndefined();
  });
  test('does not throw when storage is blocked', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(loadState()).toBeUndefined();
  });
});

test('saveState never throws, even when the quota is exceeded', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
  expect(() => saveState({ a: 1 })).not.toThrow();
});
