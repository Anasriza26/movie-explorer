/** "2024-05-12" -> "2024". Unreleased movies often have an empty date. */
export const getYear = (date) => (date ? date.slice(0, 4) : 'TBA');

/** TMDB returns 0 for unrated movies; "0.0" would look like a terrible score. */
export const formatRating = (value) => (value > 0 ? value.toFixed(1) : 'NR');

/** 137 -> "2h 17m", 120 -> "2h", 45 -> "45m", 0/undefined -> null */
export const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

/**
 * "2024-05-12" -> "May 12, 2024". Built from parts on purpose: new Date("2024-05-12")
 * parses as UTC midnight and would show May 11 for users west of UTC.
 */
export const formatDate = (date) => {
  if (!date) return 'Release date to be announced';
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};
