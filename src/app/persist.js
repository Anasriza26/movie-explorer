// Single key + version suffix: if the saved shape changes, bump v1 -> v2 and old
// data is ignored instead of crashing the app.
const STORAGE_KEY = 'movie-explorer:v1';

/** Returns the saved object, or undefined if missing/corrupt/unavailable. */
export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : undefined;
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined; // private mode, blocked storage, or invalid JSON
  }
};

/** Best-effort save: failing to persist must never break the app. */
export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or storage disabled: ignore
  }
};
