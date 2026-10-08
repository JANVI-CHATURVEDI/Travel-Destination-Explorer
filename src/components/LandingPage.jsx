import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placesIndex from '../data/placesIndex';
import { fetchClimate } from '../lib/climate';
import { fetchPois } from '../lib/pois';
import { useLivePlaces } from '../hooks/useLivePlaces';
import {
  ArrowRightIcon, CameraIcon, CloudSunIcon, FlagIcon,
  MapPinIcon, SearchIcon, StarIcon, SunIcon, VibeIcon,
} from './icons';

const HERO =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400&auto=format&fit=crop';

const REGION_STYLE = {
  Europe: 'from-indigo-500 to-sky-400',
  Asia: 'from-rose-500 to-amber-400',
  Africa: 'from-amber-500 to-yellow-300',
  'North America': 'from-emerald-500 to-teal-300',
  'South America': 'from-lime-500 to-emerald-400',
  Australia: 'from-cyan-500 to-blue-400',
};

function Diamond() {
  return <span className="inline-block h-1.5 w-1.5 rotate-45 bg-emerald-400" aria-hidden="true" />;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [moodQ, setMoodQ] = useState('');

  const featured = useMemo(
    () => [...placesIndex].sort((a, b) => b.rating - a.rating).slice(0, 6),
    []
  );
  const { details } = useLivePlaces(featured);
  const vibes = useMemo(() => [...new Set(placesIndex.map((p) => p.vibe))].sort(), []);
  const regions = useMemo(() => [...new Set(placesIndex.map((p) => p.continent))].sort(), []);
  const shownVibes = useMemo(() => {
    const s = moodQ.trim().toLowerCase();
    if (!s) return vibes;
    return vibes.filter((v) => v.toLowerCase().includes(s));
  }, [vibes, moodQ]);

  const goSearch = (e) => {
    e?.preventDefault();
    navigate(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : '/explore');
  };
  const goMoodSearch = (e) => {
    e?.preventDefault();
    if (moodQ.trim()) navigate(`/explore?q=${encodeURIComponent(moodQ.trim())}`);
  };

  return (
    <div className="bg-stone-50">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img
          src={HERO}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/25 to-stone-950" />
        <div className="animate-floaty pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="animate-floaty pointer-events-none absolute -right-16 top-64 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="animate-fade-up flex justify-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              Live photos · Live weather · Live map
            </p>
          </div>
          <h1 className="font-display animate-fade-up delay-100 mx-auto mt-6 max-w-4xl text-center text-5xl font-bold leading-[1.04] tracking-tight sm:text-7xl">
            Discover the world,
            <br />
            <span className="text-gradient">live as it happens.</span>
          </h1>
          <p className="animate-fade-up delay-200 mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/80 sm:text-lg">
            {placesIndex.length} hand-picked places across {regions.length} regions. Every photo,
            story, temperature and country fact streams fresh from free public APIs.
          </p>

          <form
            onSubmit={goSearch}
            className="animate-fade-up delay-300 mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-white/20 bg-white/10 p-2 pl-5 backdrop-blur-xl"
          >
            <SearchIcon className="h-5 w-5 shrink-0 text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try Kyoto, Petra, Banff…"
              className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 px-6 py-3 text-sm font-bold text-stone-950 transition hover:scale-[1.03]"
            >
              Search <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-white/50">Trending:</span>
            {['Bali', 'Petra', 'Kyoto', 'Banff'].map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/explore?q=${t}`)}
                className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-semibold text-white/85 backdrop-blur transition hover:bg-white/25 hover:text-white"
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [String(placesIndex.length), 'Curated places'],
              [String(regions.length), 'World regions'],
              ['3', 'Live APIs'],
              ['5-day', 'Forecasts'],
            ].map(([n, l]) => (
              <div
                key={l}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur"
              >
                <p className="font-display text-3xl font-bold">{n}</p>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-stone-950/60 py-3 backdrop-blur">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
              {[...placesIndex, ...placesIndex].map((p, i) => (
                <span key={i} className="flex items-center gap-8">
                  {p.name} <Diamond />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
              Featured · photos load live
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Loved by explorers
            </h2>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-stone-700"
          >
            View all {placesIndex.length} <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => {
            const d = details[p.id];
            const img = d?.summary?.image;
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/explore/${p.id}`)}
                onMouseEnter={() => {
                  fetchPois(p).catch(() => null);
                  fetchClimate(p.lat, p.lng).catch(() => null);
                }}
                className="card-lift group relative overflow-hidden rounded-[1.75rem] text-left shadow-sm"
              >
                <div className={`h-80 w-full ${img ? '' : 'img-loading'}`}>
                  {img && (
                    <img
                      src={img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-stone-800 shadow">
                  <span className="text-stone-400">#{i + 1}</span>
                  <StarIcon className="h-3.5 w-3.5 text-amber-500" /> {p.rating.toFixed(1)}
                </span>
                <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-stone-950/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  <VibeIcon vibe={p.vibe} className="h-3.5 w-3.5" /> {p.vibe}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                    {p.continent}
                  </p>
                  <p className="font-display text-3xl font-bold text-white">{p.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/75">
                    {d?.summary?.extract
                      ? d.summary.extract.split('. ').slice(0, 1).join('. ') + '.'
                      : 'Loading live story…'}
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-white">
                    Open live guide <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-stone-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-stone-900">
            Travel by mood
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            The wheel spins on its own — hover to pause, click a mood to explore it, or search below.
          </p>

          <div className="orbit-wrap relative mx-auto mt-8 hidden h-[560px] w-[560px] md:block">
            <div className="absolute inset-8 rounded-full border border-dashed border-stone-200" />
            <div className="absolute inset-24 rounded-full border border-stone-100" />
            <div className="orbit-ring absolute inset-0">
              {shownVibes.map((v, i) => {
                const a = (360 / Math.max(shownVibes.length, 1)) * i;
                return (
                  <div
                    key={v}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `rotate(${a}deg) translate(218px) rotate(${-a}deg)` }}
                  >
                    <div className="orbit-counter">
                      <button
                        onClick={() => navigate(`/explore?vibe=${encodeURIComponent(v)}`)}
                        className="group flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-stone-200 bg-stone-50 text-stone-700 shadow-sm transition hover:scale-110 hover:border-emerald-600 hover:bg-emerald-950 hover:text-white hover:shadow-xl"
                      >
                        <VibeIcon vibe={v} className="h-6 w-6" />
                        <span className="px-1 text-center text-[11px] font-bold leading-tight">{v}</span>
                        <span className="text-[10px] font-semibold opacity-60">
                          {placesIndex.filter((p) => p.vibe === v).length} places
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-stone-200 bg-white p-5 text-center shadow-xl">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-emerald-950 text-white">
                <SearchIcon className="h-5 w-5" />
              </span>
              <p className="font-display mt-2 text-xl font-bold text-stone-900">Find your mood</p>
              <form onSubmit={goMoodSearch} className="mt-3 flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 p-1.5 pl-3.5">
                <input
                  value={moodQ}
                  onChange={(e) => setMoodQ(e.target.value)}
                  placeholder="Romantic, Chill…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />
                <button type="submit" aria-label="Search moods" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-900 text-white transition hover:bg-emerald-800">
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-2 text-[11px] font-semibold text-stone-400">
                {shownVibes.length} of {vibes.length} moods on the wheel
              </p>
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <form onSubmit={goMoodSearch} className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 p-2 pl-4">
              <SearchIcon className="h-4 w-4 shrink-0 text-stone-400" />
              <input
                value={moodQ}
                onChange={(e) => setMoodQ(e.target.value)}
                placeholder="Search moods or places…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
              />
              <button type="submit" aria-label="Search" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-900 text-white">
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-4 flex overflow-hidden">
              <div className="animate-marquee flex shrink-0 gap-3 pr-3">
                {[...shownVibes, ...shownVibes].map((v, i) => (
                  <button
                    key={`${v}-${i}`}
                    onClick={() => navigate(`/explore?vibe=${encodeURIComponent(v)}`)}
                    className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-950 text-white">
                      <VibeIcon vibe={v} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-stone-900">{v}</span>
                      <span className="block text-xs text-stone-500">{placesIndex.filter((p) => p.vibe === v).length} places</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2 className="font-display mt-12 text-3xl font-bold tracking-tight text-stone-900">
            Travel by region
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => navigate(`/explore?continent=${encodeURIComponent(r)}`)}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-left text-white shadow-lg transition hover:scale-[1.03] ${REGION_STYLE[r] || 'from-stone-500 to-stone-700'}`}
              >
                <MapPinIcon className="h-7 w-7 text-white/90" />
                <p className="mt-6 text-lg font-bold leading-tight">{r}</p>
                <p className="flex items-center gap-1 text-xs font-semibold text-white/80">
                  {placesIndex.filter((p) => p.continent === r).length} places
                  <ArrowRightIcon className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
          Under the hood
        </p>
        <h2 className="font-display mx-auto mt-2 max-w-xl text-center text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Nothing stale. Everything streams live.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [CameraIcon, 'Wikipedia', 'Photos + stories', 'Every card and guide pulls its image and description from the Wikipedia REST API — cached for speed, never hard-coded.'],
            [CloudSunIcon, 'Open-Meteo', 'Weather that breathes', 'Current conditions and 5-day forecasts per coordinates. Cards show live temps; sort by “Warmest now”.'],
            [FlagIcon, 'CountriesNow + FlagCDN', 'Country intelligence', 'Capitals, populations and flags resolve live per country on each detail page, with graceful fallbacks.'],
          ].map(([Icon, name, title, d]) => (
            <div
              key={name}
              className="rounded-[1.75rem] border border-stone-200/70 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-white">
                <Icon className="h-6 w-6" />
              </p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                {name}
              </p>
              <p className="font-display mt-1 text-2xl font-bold text-stone-900">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">{d}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-stone-950 px-6 py-14 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <h3 className="font-display relative mx-auto max-w-2xl text-3xl font-bold sm:text-5xl">
            Your next story starts with <span className="text-gradient">one click.</span>
          </h3>
          <p className="relative mx-auto mt-3 max-w-xl text-white/70">
            Filter by mood, budget or temperature — then open any place for its live guide,
            forecast and map.
          </p>
          <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 px-8 py-4 text-base font-bold text-stone-950 transition hover:scale-[1.04]"
            >
              Start exploring <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/explore?sort=temp')}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <SunIcon className="h-5 w-5" /> Warmest right now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
