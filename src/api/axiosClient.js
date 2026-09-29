import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  headers: {
    accept: 'application/json',
    // NOTE: REACT_APP_* values are bundled into client code (visible to users).
    // Acceptable for a free TMDB key in a demo; production should proxy requests.
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
  },
});

// One place that turns raw errors into a friendly message + status code.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error); // our own aborts pass through untouched

    const status = error.response?.status;
    let message = 'Something went wrong. Please try again.';
    if (!error.response) message = 'Network error. Check your connection and try again.';
    else if (status === 401) message = 'Invalid API key. Check REACT_APP_TMDB_TOKEN in your .env.local file.';
    else if (status === 404) message = 'We could not find what you were looking for.';
    else if (status === 429) message = 'Too many requests. Please wait a moment.';
    else if (status >= 500) message = 'TMDB is having issues. Try again later.';

    const friendly = new Error(message);
    friendly.status = status; // undefined for network errors
    return Promise.reject(friendly);
  }
);

export default client;
