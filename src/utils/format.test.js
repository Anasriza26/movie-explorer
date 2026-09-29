import { formatDate, formatRating, formatRuntime, getYear } from './format';

test('getYear handles missing dates', () => {
  expect(getYear('2024-05-12')).toBe('2024');
  expect(getYear('')).toBe('TBA');
  expect(getYear(undefined)).toBe('TBA');
});

test('formatRating shows NR for unrated movies', () => {
  expect(formatRating(7.456)).toBe('7.5');
  expect(formatRating(0)).toBe('NR');
});

test.each([[137, '2h 17m'], [120, '2h'], [45, '45m'], [0, null], [undefined, null]])(
  'formatRuntime(%s) -> %s', (input, expected) => expect(formatRuntime(input)).toBe(expected)
);

test('formatDate does not shift the day across timezones', () => {
  expect(formatDate('2024-05-12')).toMatch(/12/);
  expect(formatDate('')).toBe('Release date to be announced');
});
