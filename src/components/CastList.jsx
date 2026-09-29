import { profileUrl } from '../utils/image';

/** Horizontally scrollable row: a natural fit for touch screens. */
export default function CastList({ cast }) {
  if (!cast.length) return null;

  return (
    <section aria-labelledby="cast-heading" className="mt-2">
      <h2 id="cast-heading" className="heading !text-xl">Top cast</h2>
      <ul className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3">
        {cast.map((person) => {
          const photo = profileUrl(person.profile_path);
          return (
            <li key={person.credit_id} className="w-24 shrink-0 snap-start text-center sm:w-28">
              {photo ? (
                // alt="" because the name is printed right below (decorative image)
                <img src={photo} alt="" loading="lazy" className="mx-auto h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24" />
              ) : (
                <div aria-hidden className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-500 dark:bg-ink-700 sm:h-24 sm:w-24">
                  {person.name.charAt(0)}
                </div>
              )}
              <p className="mt-2 text-sm font-bold leading-tight">{person.name}</p>
              {person.character && (
                <p className="text-xs text-slate-500 dark:text-slate-400">{person.character}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
