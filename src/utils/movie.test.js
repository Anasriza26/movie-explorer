import { pickDetails, pickMovie } from './movie';

const raw = (overrides = {}) => ({
  id: 1, title: 'Test', genres: [{ id: 1, name: 'Drama', extra: 'x' }],
  credits: { cast: Array.from({ length: 30 }, (_, i) => ({ credit_id: `c${i}`, id: i, name: `A${i}` })), crew: [] },
  videos: { results: [] },
  ...overrides,
});

test('pickMovie keeps only the rendered fields', () => {
  const out = pickMovie({ id: 1, title: 'T', poster_path: '/p', release_date: '2020-01-01', vote_average: 7, overview: 'x', adult: false });
  expect(Object.keys(out).sort()).toEqual(['id', 'poster_path', 'release_date', 'title', 'vote_average']);
});

describe('pickDetails', () => {
  test('keeps only the top 10 cast members', () => {
    expect(pickDetails(raw()).cast).toHaveLength(10);
  });

  test('prefers an official YouTube trailer and ignores other sites', () => {
    const videos = { results: [
      { site: 'Vimeo', type: 'Trailer', official: true, key: 'vimeo1' },
      { site: 'YouTube', type: 'Teaser', official: true, key: 'teaser' },
      { site: 'YouTube', type: 'Trailer', official: false, key: 'fan' },
      { site: 'YouTube', type: 'Trailer', official: true, key: 'official' },
    ] };
    expect(pickDetails(raw({ videos })).trailerKey).toBe('official');
  });

  test('handles missing credits, videos and genres', () => {
    const result = pickDetails({ id: 2, title: 'Bare' });
    expect(result.trailerKey).toBeNull();
    expect(result.cast).toEqual([]);
    expect(result.director).toBeNull();
    expect(result.genres).toEqual([]);
  });

  test('finds the director and strips unused genre fields', () => {
    const credits = { cast: [], crew: [{ job: 'Writer', name: 'W' }, { job: 'Director', name: 'D' }] };
    const result = pickDetails(raw({ credits }));
    expect(result.director).toBe('D');
    expect(result.genres[0]).toEqual({ id: 1, name: 'Drama' });
  });
});
