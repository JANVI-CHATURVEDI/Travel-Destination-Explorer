import { SearchIcon } from './icons';

export default function FilterBar({ search, setSearch, continent, setContinent, vibe, setVibe, budget, setBudget, minRating, setMinRating, sort, setSort, continents, vibes, budgets, onReset, count, total }) {
  const selectCls = 'w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';
  return (
    <div className="rounded-3xl border border-stone-200/70 bg-white p-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations, e.g. Kyoto, Bali, Petra…"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
          <select value={continent} onChange={(e) => setContinent(e.target.value)} className={selectCls} aria-label="Continent">
            <option value="All">All regions</option>
            {continents.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={vibe} onChange={(e) => setVibe(e.target.value)} className={selectCls} aria-label="Vibe">
            <option value="All">All vibes</option>
            {vibes.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selectCls} aria-label="Budget">
            <option value="All">Any budget</option>
            {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={selectCls} aria-label="Rating">
            <option value="All">Any rating</option>
            <option value="4.7">4.7+</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls} aria-label="Sort">
            <option value="rating">Top rated</option>
            <option value="name">A → Z</option>
            <option value="temp">Warmest now</option>
          </select>
          <button onClick={onReset} className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700">
            Reset
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-stone-500">
        Showing <span className="font-bold text-stone-800">{count}</span> of {total} places · photos + weather load live
      </p>
    </div>
  );
}
