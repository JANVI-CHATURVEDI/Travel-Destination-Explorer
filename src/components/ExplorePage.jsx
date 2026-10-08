import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import placesIndex from '../data/placesIndex';
import { fetchClimate } from '../lib/climate';
import { fetchPois } from '../lib/pois';
import { CompassIcon } from './icons';
import { useLivePlaces } from '../hooks/useLivePlaces';
import FilterBar from './FilterBar';
import DestinationCard, { CardSkeleton } from './DestinationCard';
import MapView from './MapView';

export default function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const continent = params.get('continent') ?? 'All';
  const vibe = params.get('vibe') ?? 'All';
  const budget = params.get('budget') ?? 'All';
  const minRating = params.get('rating') ?? 'All';
  const sort = params.get('sort') ?? 'rating';

  const patch = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === 'All' || (k === 'q' && v === '') || (k === 'sort' && v === 'rating')) p.delete(k);
      else p.set(k, v);
    });
    setParams(p, { replace: true });
  };

  const setSearch = (q) => patch({ q });
  const setContinent = (continent) => patch({ continent });
  const setVibe = (vibe) => patch({ vibe });
  const setBudget = (budget) => patch({ budget });
  const setMinRating = (rating) => patch({ rating });
  const setSort = (sort) => patch({ sort });
  const reset = () => setParams({}, { replace: true });

  const { details } = useLivePlaces(placesIndex);
  const [focused, setFocused] = useState(null);

  const continents = useMemo(() => [...new Set(placesIndex.map((p) => p.continent))].sort(), []);
  const vibes = useMemo(() => [...new Set(placesIndex.map((p) => p.vibe))].sort(), []);
  const budgets = useMemo(() => [...new Set(placesIndex.map((p) => p.budget))], []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = placesIndex.filter((p) => {
      if (q && !`${p.name}`.toLowerCase().includes(q)) return false;
      if (continent !== 'All' && p.continent !== continent) return false;
      if (vibe !== 'All' && p.vibe !== vibe) return false;
      if (budget !== 'All' && p.budget !== budget) return false;
      if (minRating !== 'All' && p.rating < parseFloat(minRating)) return false;
      return true;
    });
    const tempOf = (p) => details[p.id]?.weather?.current?.temp ?? -999;
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'temp') list.sort((a, b) => tempOf(b) - tempOf(a));
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, continent, vibe, budget, minRating, sort, details]);

  const loadedCount = placesIndex.filter((p) => details[p.id]).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative mb-6 overflow-hidden rounded-[2rem] bg-stone-950 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-300">● Live explorer</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Find your next destination</h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/65">
              Photos from Wikipedia · weather from Open-Meteo · facts from CountriesNow. Filters sync to the URL — share any view.
            </p>
          </div>
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-emerald-200 backdrop-blur">
            ● Live: {loadedCount}/{placesIndex.length} enriched
          </p>
        </div>
      </div>

      <FilterBar
        search={search} setSearch={setSearch}
        continent={continent} setContinent={setContinent}
        vibe={vibe} setVibe={setVibe}
        budget={budget} setBudget={setBudget}
        minRating={minRating} setMinRating={setMinRating}
        sort={sort} setSort={setSort}
        continents={continents} vibes={vibes} budgets={budgets}
        onReset={reset} count={filtered.length} total={placesIndex.length}
      />

      <div className="mt-6" onMouseLeave={() => setFocused(null)}>
        <MapView locations={filtered} selected={focused} />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-stone-100 text-stone-500">
            <CompassIcon className="h-7 w-7" />
          </span>
          <p className="mt-2 font-display text-2xl font-bold text-stone-800">No matches</p>
          <p className="mt-1 text-sm text-stone-500">Try widening the filters or clearing the search.</p>
          <button onClick={reset} className="mt-4 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-700">Clear all filters</button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) =>
            details[p.id] ? (
              <div
                key={p.id}
                onMouseEnter={() => {
                  setFocused(p);
                  fetchPois(p).catch(() => null);
                  fetchClimate(p.lat, p.lng).catch(() => null);
                }}
              >
                <DestinationCard place={p} summary={details[p.id].summary} weather={details[p.id].weather} />
              </div>
            ) : (
              <CardSkeleton key={p.id} />
            )
          )}
        </div>
      )}
    </div>
  );
}
