import client from './axiosClient';

/** One function per endpoint: components never know URLs. */

export const getTrending = (page = 1, signal) =>
  client.get('/trending/movie/week', { params: { page }, signal }).then((r) => r.data);

export const searchMovies = (query, page = 1, signal) =>
  client
    .get('/search/movie', { params: { query, page, include_adult: false }, signal })
    .then((r) => r.data);

export const discoverMovies = (params, signal) =>
  client.get('/discover/movie', { params, signal }).then((r) => r.data);

/** One request returns details + cast + videos (append_to_response). */
export const getMovieDetails = (id) =>
  client
    .get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos', include_video_language: 'en,null' },
    })
    .then((r) => r.data);

export const getGenres = () => client.get('/genre/movie/list').then((r) => r.data.genres);
