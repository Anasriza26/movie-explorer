# 🎬 Movie Explorer

Discover trending movies, search by title, filter by genre / year / rating, watch trailers and
save favorites. Built with **React (Create React App)**, **Redux Toolkit**, **Tailwind CSS**,
**Material-UI** and **Axios** on the [TMDB](https://www.themoviedb.org/) API.

**Live demo:** _add your Vercel URL here_
**Demo login:** `demo` / `movie123` (mock authentication, see Known limitations)

## Features

- Mock login with validation and protected routes (redirects back to where you were headed)
- Trending movies with **Load more**
- Debounced search with **infinite scroll**; the last successful search is remembered
- **Discover** page: filter by genre, year and minimum rating, sort, **Load more**. Filters live in the URL
- Movie details: overview, genres, runtime, director, top cast, **YouTube trailer** dialog
- Favorites saved locally, **separately for each user**
- **Light / dark mode** (follows your OS until you choose; no flash on load)
- Mobile-first responsive layout (2 → 7 grid columns), keyboard and screen-reader friendly
- Friendly errors with retry, empty states, loading skeletons, an error boundary

## Quick start

Requirements: **Node.js 18+** (20 recommended) and a free TMDB account.

```bash
npm install
cp .env.example .env.local        # Windows PowerShell: copy .env.example .env.local
# open .env.local and paste your TMDB "API Read Access Token"
npm start                         # http://localhost:3000
```

Get the token at https://www.themoviedb.org/settings/api (the long **API Read Access Token**, not the short API Key).
Restart `npm start` after editing `.env.local`; environment variables are read at startup.

| Script | What it does |
|---|---|
| `npm start` | Dev server |
| `npm test` | Tests in watch mode |
| `npm run test:ci` | Tests once, with coverage |
| `npm run build` | Production build (`CI=true npm run build` treats warnings as errors, like Vercel) |

## How styling works (Tailwind + MUI together)

- **Tailwind** styles our own markup: layout, spacing, colors, responsive grid, cards, hero.
- **MUI** supplies the hard interactive widgets: `Dialog` (trailer), `Menu` (account), `Slider` (rating) and icons.
- Tailwind's reset (**preflight**) is disabled so it doesn't fight MUI's styles; a small base layer lives in `src/index.css`.
- Dark mode is class-based: `<html class="dark">` is toggled from the Redux `ui` slice.
- Brand tokens (marquee amber, ink blues, fonts) are in `tailwind.config.js`. Reusable classes (`.btn`, `.field`, `.icon-btn`, `.heading`) are in `src/index.css`.
- Responsive rule: mobile-first. Unprefixed classes are phones; `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px, `2xl:` 1536px.

## API usage (TMDB v3)

| Endpoint | Used for |
|---|---|
| `GET /trending/movie/week` | Home page |
| `GET /search/movie` | Search |
| `GET /discover/movie` | Filters and sorting |
| `GET /movie/{id}?append_to_response=credits,videos` | Details, cast and trailer in **one** request |
| `GET /genre/movie/list` | Genre filter options |

## Project structure

```
src/
├── api/         axios client (one error interceptor) + one function per endpoint
├── app/         store, MUI theme, localStorage persistence
├── features/    Redux slices, one folder per feature
│                (auth, trending, search, discover, details, favorites, genres, ui)
├── components/  reusable UI (MovieCard, MovieGrid, SearchBar, FilterBar, FavoriteButton, ...)
├── pages/       route-level screens
├── hooks/       useInfiniteScroll, useDebouncedCallback
└── utils/       pure functions (formatting, filter parsing, validation)
```

## Key design decisions

- **URL as the source of truth** for search queries and filters: shareable links, working Back button, refresh-safe.
- **Race-condition protection** on search and discover: abort in-flight requests, ignore responses for a stale query, never render another query's items.
- **Details cached per movie id**; payloads are trimmed before entering Redux.
- **localStorage is treated as untrusted**: everything is validated on load; corrupt data is repaired or discarded, never crashes the app.
- **Only user choices are persisted** (theme, last successful search, user, favorites), so the OS theme preference isn't frozen on first load.
- **Favorites are per user** and store a small snapshot, so the Favorites page needs no API calls.
- **Search and filters are separate modes** because TMDB's search endpoint cannot filter.
- **Both pagination patterns**: infinite scroll (search) and a Load more button (trending, discover).

## Known limitations

- **Authentication is simulated.** Credentials are checked client-side. A real app needs a backend and httpOnly session cookies. Route guards are UX, not security.
- **The TMDB token is bundled into client code**, so anyone can see it. In production, proxy requests through a serverless function.
- Favorites live in `localStorage`: per browser, not synced across devices. Two tabs open at once can overwrite each other (last write wins).
- Going Back to search/discover refetches page 1 and loses scroll position.
- Client-rendered SPA: link previews show one generic card for the whole site.
- Built with Create React App, which is deprecated. A new project would use Vite or Next.js.

## Deploy (Vercel)

1. Push to GitLab, then in Vercel choose **Add New → Project** and import the repo.
2. Add the environment variable `REACT_APP_TMDB_TOKEN` (Production and Preview) **before** the first deploy.
3. Deploy. `vercel.json` already contains the SPA rewrite so refreshing `/movie/603` doesn't 404.
4. Changed an env var? **Redeploy**: `REACT_APP_*` values are baked in at build time.

## Testing

92 tests cover reducers, selectors, parsers, persistence, the error boundary, and key flows
(login, protected routes, favoriting, debounced search). Run `npm run test:ci` for coverage.

## Credits

Movie data and images from [TMDB](https://www.themoviedb.org/).
This product uses the TMDB API but is not endorsed or certified by TMDB.
