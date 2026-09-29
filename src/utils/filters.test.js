import { buildDiscoverParams, filtersKey, filtersToParams, parseFilters, DEFAULT_FILTERS } from './filters';

const NOW = new Date('2026-06-15T12:00:00Z'); // fixed clock: tests never depend on today's date
const parse = (qs) => parseFilters(new URLSearchParams(qs), NOW);

describe('parseFilters', () => {
  test('reads valid values', () => {
    expect(parse('genre=28&year=2020&rating=7&sort=vote_average.desc')).toEqual({
      genre: '28', year: '2020', rating: 7, sort: 'vote_average.desc',
    });
  });

  test.each([
    'genre=abc', 'genre=-5', 'genre=0', 'year=banana', 'year=1800', 'year=3000',
    'rating=10', 'rating=-1', 'rating=abc', 'sort=DROP TABLE',
  ])('falls back to defaults for invalid input: %s', (qs) => {
    expect(parse(qs)).toEqual(DEFAULT_FILTERS);
  });

  test('normalises equivalent genre ids to one key', () => {
    expect(parse('genre=007').genre).toBe('7');
  });

  test('allows next year but not two years ahead', () => {
    expect(parse('year=2027').year).toBe('2027');
    expect(parse('year=2028').year).toBe('');
  });
});

describe('filtersToParams / filtersKey', () => {
  test('no filters means an empty key', () => {
    expect(filtersKey(DEFAULT_FILTERS)).toBe('');
  });
  test('round-trips with a stable order', () => {
    const f = { genre: '28', year: '2020', rating: 7, sort: 'primary_release_date.desc' };
    expect(parse(filtersToParams(f).toString())).toEqual(f);
    expect(filtersKey(f)).toBe('genre=28&year=2020&rating=7&sort=primary_release_date.desc');
  });
});

describe('buildDiscoverParams', () => {
  test('a rating filter also requires a minimum vote count', () => {
    const p = buildDiscoverParams({ ...DEFAULT_FILTERS, rating: 8 }, 1, NOW);
    expect(p['vote_average.gte']).toBe(8);
    expect(p['vote_count.gte']).toBe(100);
  });
  test('no filters: no filter params, adult content excluded', () => {
    expect(buildDiscoverParams(DEFAULT_FILTERS, 3, NOW)).toEqual({ page: 3, include_adult: false, sort_by: 'popularity.desc' });
  });
  test('"newest first" excludes unreleased movies', () => {
    const p = buildDiscoverParams({ ...DEFAULT_FILTERS, sort: 'primary_release_date.desc' }, 1, NOW);
    expect(p['primary_release_date.lte']).toBe('2026-06-15');
  });
});
