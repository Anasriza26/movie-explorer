const BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path, size = 'w342') =>
  path ? `${BASE}/${size}${path}` : '/placeholder-poster.svg';
export const backdropUrl = (path, size = 'w1280') => (path ? `${BASE}/${size}${path}` : null);
export const profileUrl = (path, size = 'w185') => (path ? `${BASE}/${size}${path}` : null);
