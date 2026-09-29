import { useEffect, useMemo, useState } from 'react';
import { Slider } from '@mui/material';
import { hasActiveFilters, MIN_YEAR, SORT_OPTIONS } from '../utils/filters';

/** Controlled component: the URL owns the filters. Only the slider keeps in-flight state. */
export default function FilterBar({ filters, genres, onChange, onClear }) {
  // The thumb must move smoothly while dragging, but only COMMITTING (release / key press)
  // changes the URL, so a drag never fires a request per pixel.
  const [rating, setRating] = useState(filters.rating);
  useEffect(() => setRating(filters.rating), [filters.rating]); // Back/Forward/Clear

  const years = useMemo(() => {
    const max = new Date().getFullYear() + 1;
    return Array.from({ length: max - MIN_YEAR + 1 }, (_, i) => String(max - i));
  }, []);

  // A <select> whose value has no matching <option> misbehaves, so show it empty until genres load.
  const genresReady = genres.status === 'succeeded';

  return (
    <section
      aria-label="Filters"
      className="mb-6 grid grid-cols-2 items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)_auto]"
    >
      <div className="col-span-2 sm:col-span-1">
        <label htmlFor="f-genre" className="field-label">Genre</label>
        <select
          id="f-genre"
          className="field"
          disabled={!genresReady}
          value={genresReady ? filters.genre : ''}
          onChange={(e) => onChange({ genre: e.target.value })}
        >
          <option value="">Any genre</option>
          {genres.items.map((g) => (
            <option key={g.id} value={String(g.id)}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="f-year" className="field-label">Year</label>
        <select id="f-year" className="field" value={filters.year} onChange={(e) => onChange({ year: e.target.value })}>
          <option value="">Any year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="f-sort" className="field-label">Sort by</label>
        <select id="f-sort" className="field" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="col-span-2 px-2 sm:col-span-3 lg:col-span-1">
        <span id="rating-label" className="field-label">
          Minimum rating: {rating === 0 ? 'Any' : `${rating}+`}
        </span>
        <Slider
          size="small" min={0} max={9} step={1} marks
          value={rating}
          valueLabelDisplay="auto"
          aria-labelledby="rating-label"
          getAriaValueText={(v) => (v === 0 ? 'Any rating' : `${v} or higher`)}
          onChange={(_, v) => setRating(v)}
          onChangeCommitted={(_, v) => v !== filters.rating && onChange({ rating: v })}
        />
      </div>

      {hasActiveFilters(filters) && (
        <button type="button" onClick={onClear} className="btn btn-outline col-span-2 sm:col-span-1">
          Clear filters
        </button>
      )}
    </section>
  );
}
