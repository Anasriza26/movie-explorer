/** Keep only what the UI renders. Full TMDB objects have ~20 unused fields. */
export const pickMovie = ({ id, title, poster_path, release_date, vote_average }) => ({
  id,
  title,
  poster_path,
  release_date,
  vote_average,
});

/** Prefer an official YouTube trailer, then any trailer, then a teaser. */
const pickTrailerKey = (videos = []) => {
  const youtube = videos.filter((v) => v.site === 'YouTube');
  const best =
    youtube.find((v) => v.type === 'Trailer' && v.official) ??
    youtube.find((v) => v.type === 'Trailer') ??
    youtube.find((v) => v.type === 'Teaser');
  return best?.key ?? null;
};

/** Reduce TMDB's huge details response to what the details page renders. */
export const pickDetails = (raw) => ({
  id: raw.id,
  title: raw.title,
  tagline: raw.tagline || '',
  overview: raw.overview || '',
  poster_path: raw.poster_path,
  backdrop_path: raw.backdrop_path,
  release_date: raw.release_date,
  runtime: raw.runtime,
  vote_average: raw.vote_average,
  vote_count: raw.vote_count,
  genres: (raw.genres ?? []).map(({ id, name }) => ({ id, name })),
  // TMDB orders cast by billing, so the first 10 are the leads.
  cast: (raw.credits?.cast ?? [])
    .slice(0, 10)
    .map(({ credit_id, id, name, character, profile_path }) => ({
      credit_id, id, name, character, profile_path,
    })),
  director: raw.credits?.crew?.find((p) => p.job === 'Director')?.name ?? null,
  trailerKey: pickTrailerKey(raw.videos?.results),
});
