import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import placesIndex, { haversineKm } from '../data/placesIndex';
import { fetchCountryFacts, fetchPlaceSummary, weatherLabel } from '../lib/api';
import { cuisineBreakdown, rankSights } from '../lib/pois';
import {
  useClimate, useElevation, useLivePlace, useLivePlaces, usePois, useSummary,
} from '../hooks/useLivePlaces';
import DestinationCard from './DestinationCard';
import { budgetStyle } from './DestinationCard';
import {
  ArrowRightIcon, BuildingIcon, CameraIcon, DropletIcon,
  MapPinIcon, StarIcon, UtensilsIcon, WeatherIcon, WindIcon,
} from './icons';

const FALLBACK = 'https://picsum.photos/seed/travel/1200/700';

const CUISINE = {
  France: 'French cuisine', Indonesia: 'Indonesian cuisine', 'United States': 'American cuisine',
  'South Africa': 'South African cuisine', Japan: 'Japanese cuisine', Greece: 'Greek cuisine',
  Iceland: 'Icelandic cuisine', Thailand: 'Thai cuisine', Peru: 'Peruvian cuisine',
  Italy: 'Italian cuisine', 'United Arab Emirates': 'Emirati cuisine', Canada: 'Canadian cuisine',
  Australia: 'Australian cuisine', 'Czech Republic': 'Czech cuisine', India: 'Indian cuisine',
  'New Zealand': 'New Zealand cuisine', Egypt: 'Egyptian cuisine', Vietnam: 'Vietnamese cuisine',
  Brazil: 'Brazilian cuisine', Switzerland: 'Swiss cuisine', Morocco: 'Moroccan cuisine',
  Jordan: 'Jordanian cuisine',
};

const BUDGETS = {
  Low: {
    sleep: '$8–20', eat: '$2–7', move: '$1–4', bars: [22, 14, 10],
    note: 'Hostels, street food and metro passes stretch every dollar.',
  },
  Medium: {
    sleep: '$35–90', eat: '$9–24', move: '$4–10', bars: [55, 42, 26],
    note: 'Boutique stays, sit-down meals and ride-hails without splurging.',
  },
  High: {
    sleep: '$150–400', eat: '$25–75', move: '$12–35', bars: [92, 72, 48],
    note: 'Design hotels, fine dining and private drivers.',
  },
};

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'best-time', label: 'Best time' },
  { id: 'dont-miss', label: "Don't miss" },
  { id: 'stay', label: 'Stay' },
  { id: 'eat', label: 'Eat' },
  { id: 'facts', label: 'Facts' },
  { id: 'budget', label: 'Budget' },
];

function snippet(extract, n = 2) {
  if (!extract || typeof extract !== 'string') return '';
  const out = extract.split('. ').slice(0, n).join('. ');
  return out ? out + '.' : '';
}

function titleCase(s) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

export default function DestinationDetail() {
  const { id } = useParams();
  const place = placesIndex.find((p) => p.id === id);
  const { loading, summary, weather } = useLivePlace(place);
  const { loading: climateLoading, climate } = useClimate(place);
  const { loading: poisLoading, pois } = usePois(place);
  const { summary: cuisine } = useSummary(place ? CUISINE[place.country] : '');
  const elevM = useElevation(place);
  const [country, setCountry] = useState(null);
  const [blurbs, setBlurbs] = useState({});
  const [vegFilter, setVegFilter] = useState('all');
  const [showStay, setShowStay] = useState(true);
  const [showEat, setShowEat] = useState(true);
  const [showSights, setShowSights] = useState(true);
  const [active, setActive] = useState('overview');

  useEffect(() => {
    if (!place) return;
    fetchCountryFacts(place.country, place.countryCode).then(setCountry).catch(() => setCountry(null));
  }, [place]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const nearby = useMemo(() => {
    if (!place) return [];
    return placesIndex
      .filter((p) => p.id !== place.id)
      .map((p) => ({ ...p, km: Math.round(haversineKm(place, p)) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 3);
  }, [place]);

  const { details } = useLivePlaces(nearby, { enabled: nearby.length > 0 });

  const dontMiss = useMemo(() => rankSights(pois?.sights || []), [pois]);

  useEffect(() => {
    let cancelled = false;
    dontMiss.forEach((s) => {
      if (blurbs[s.name]) return;
      fetchPlaceSummary(s.name)
        .catch(() => null)
        .then((r) => {
          if (!cancelled && r?.extract) {
            setBlurbs((b) => ({ ...b, [s.name]: snippet(r.extract) }));
          }
        });
    });
    return () => {
      cancelled = true;
    };
  }, [dontMiss, blurbs]);

  const eatList = pois?.eat || [];
  const vegCounts = useMemo(
    () => ({
      only: eatList.filter((p) => p.vegOnly).length,
      friendly: eatList.filter((p) => p.vegOptions && !p.vegOnly).length,
      vegan: eatList.filter((p) => p.vegan).length,
    }),
    [eatList]
  );
  const filteredEat = useMemo(() => {
    if (vegFilter === 'only') return eatList.filter((p) => p.vegOnly);
    if (vegFilter === 'friendly') return eatList.filter((p) => p.vegOptions);
    if (vegFilter === 'vegan') return eatList.filter((p) => p.vegan);
    return eatList;
  }, [eatList, vegFilter]);
  const topCuisines = useMemo(() => cuisineBreakdown(eatList), [eatList]);
  const maxCuisine = topCuisines.length ? topCuisines[0][1] : 1;

  const localTime =
    weather && typeof weather.utcOffset === 'number'
      ? new Date(Date.now() + weather.utcOffset * 1000).toISOString().slice(11, 16)
      : '';
  const tzShort = (weather?.tz || '').split('/').pop()?.replace(/_/g, ' ') || '';
  const sun = (iso) => (iso && iso.length >= 16 ? iso.slice(11, 16) : '—');
  const bestLabels = (climate?.best || []).map((i) => climate.months[i].label).join(' · ');
  const budget = BUDGETS[place?.budget] || BUDGETS.Medium;

  if (!place) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-stone-100 text-stone-500">
          <MapPinIcon className="h-7 w-7" />
        </span>
        <h1 className="font-display mt-3 text-3xl font-bold">Place not found</h1>
        <Link to="/explore" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-950 px-6 py-3 text-sm font-semibold text-white">
          <ArrowRightIcon className="h-4 w-4 rotate-180" /> Back to explore
        </Link>
      </div>
    );
  }

  const img = summary?.image || FALLBACK;
  const temp = weather?.current?.temp;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/explore" className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-900">
        <ArrowRightIcon className="h-4 w-4 rotate-180" /> All destinations
      </Link>

      <div className="relative mt-4 overflow-hidden rounded-[2rem] bg-stone-900">
        <img
          src={img}
          alt={place.name}
          className={`h-[380px] w-full object-cover sm:h-[460px] ${loading ? 'img-loading' : ''}`}
          onError={(e) => {
            if (!e.currentTarget.src.includes('picsum')) e.currentTarget.src = FALLBACK;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
        <div className="absolute left-0 right-0 top-4 flex justify-between px-5">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-stone-800">
            <StarIcon className="h-3.5 w-3.5 text-amber-500" /> {place.rating.toFixed(1)} editorial rating
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${budgetStyle(place.budget)}`}>
            {place.budget} budget
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
            {place.continent} · {place.vibe}
          </p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white sm:text-6xl">{place.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
            {loading
              ? 'Loading live description from Wikipedia…'
              : snippet(summary?.extract) ||
                'Live description is unavailable right now — the photo, weather and map below still load live.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {typeof temp === 'number' && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <WeatherIcon code={weather.current.code} className="h-4 w-4" /> {Math.round(temp)}°C ·{' '}
                {weatherLabel(weather.current.code)} · live
              </span>
            )}
            {bestLabels && (
              <span className="rounded-full bg-amber-300/90 px-4 py-2 text-sm font-bold text-stone-900">
                Best: {bestLabels}
              </span>
            )}
            <a
              href={summary?.wikiUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-900 hover:bg-stone-100"
            >
              Wikipedia ↗
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-400"
            >
              Google Maps ↗
            </a>
          </div>
        </div>
      </div>

      <nav className="sticky top-16 z-30 -mx-4 mt-6 border-y border-stone-200/70 bg-stone-50/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1.5 overflow-x-auto py-2.5">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === s.id ? 'bg-stone-900 text-white shadow' : 'text-stone-500 hover:bg-stone-200/70'
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className="mt-6 scroll-mt-36">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-stone-200/70 bg-white p-6">
            <h2 className="font-display text-xl font-bold">About · live from Wikipedia</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              {loading ? 'Fetching…' : summary?.extract || 'Description unavailable right now.'}
            </p>
            {summary?.description && (
              <p className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                {summary.description}
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Fact label="Country" value={country?.name || place.country} flag={country?.flag} />
              <Fact label="Capital" value={country?.capital || '…'} />
              <Fact
                label="Population"
                value={
                  country?.population
                    ? Intl.NumberFormat('en', { notation: 'compact' }).format(country.population)
                    : '…'
                }
              />
              <Fact label="Region" value={place.continent} />
            </div>
            {country?.about && (
              <p className="mt-4 rounded-2xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
                <span className="font-bold text-stone-800">About {country.name} · live: </span>
                {country.about}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-stone-200/70 bg-white p-6">
            <h2 className="font-display text-xl font-bold">Live weather · Open-Meteo</h2>
            {!weather?.current || !Array.isArray(weather?.daily) ? (
              <div className="mt-3 space-y-3" aria-label="Loading weather">
                <div className="img-loading h-28 rounded-2xl" />
                <div className="img-loading h-11 rounded-xl" />
                <div className="img-loading h-11 rounded-xl" />
                <div className="img-loading h-11 rounded-xl" />
                <p className="pt-1 text-center text-xs font-medium text-stone-400">
                  Fetching live conditions from Open-Meteo…
                </p>
              </div>
            ) : (
              <>
                <div className="mt-3 flex items-center gap-4 rounded-2xl bg-stone-950 p-5 text-white">
                  <WeatherIcon code={weather.current.code} className="h-12 w-12" />
                  <div>
                    <p className="text-4xl font-bold">
                      {typeof weather.current.temp === 'number' ? `${Math.round(weather.current.temp)}°C` : '—'}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-white/75">
                      {weatherLabel(weather.current.code)} · <WindIcon className="h-3.5 w-3.5" />{' '}
                      {weather.current.wind ?? '—'} km/h · <DropletIcon className="h-3.5 w-3.5" />{' '}
                      {weather.current.humidity ?? '—'}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {weather.daily.map((d) => (
                    <div
                      key={d.date}
                      className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-2.5 text-sm"
                    >
                      <span className="font-semibold">
                        {new Date(d.date + 'T12:00:00').toLocaleDateString('en', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <WeatherIcon code={d.code} className="h-4 w-4" /> {weatherLabel(d.code)}
                      </span>
                      <span className="font-bold">
                        {Math.round(d.tMax)}° / {Math.round(d.tMin)}°
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white">
            <p className="font-display px-6 pb-2 pt-6 text-xl font-bold">Where it is</p>
            <p className="px-6 pb-3 text-xs text-stone-500">
              {place.lat.toFixed(2)}, {place.lng.toFixed(2)} · toggle live POI layers
            </p>
            <div className="flex flex-wrap gap-1.5 px-6 pb-3">
              <LayerToggle on={showStay} onClick={() => setShowStay(!showStay)} color="bg-emerald-600" label={`Stay · ${pois?.stay.length ?? '…'}`} />
              <LayerToggle on={showEat} onClick={() => setShowEat(!showEat)} color="bg-amber-500" label={`Eat · ${pois?.eat.length ?? '…'}`} />
              <LayerToggle on={showSights} onClick={() => setShowSights(!showSights)} color="bg-rose-500" label={`Sights · ${pois?.sights.length ?? '…'}`} />
            </div>
            <div className="h-[340px]">
              <MapContainer
                center={[place.lat, place.lng]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[place.lat, place.lng]}>
                  <Popup>
                    <strong>{place.name}</strong>
                    <br />
                    City center
                  </Popup>
                </Marker>
                {showStay &&
                  (pois?.stay || []).slice(0, 30).map((p) => (
                    <PoiPin key={p.id} p={p} color="#047857" fill="#10b981" />
                  ))}
                {showEat &&
                  (pois?.eat || []).slice(0, 40).map((p) => (
                    <PoiPin key={p.id} p={p} color="#b45309" fill="#f59e0b" />
                  ))}
                {showSights &&
                  (pois?.sights || []).slice(0, 30).map((p) => (
                    <PoiPin key={p.id} p={p} color="#be123c" fill="#fb7185" />
                  ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      <section id="best-time" className="mt-10 scroll-mt-36">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">Climate · live 12-month record</p>
        <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-stone-900">Best time to visit</h2>
        {!climate && !climateLoading ? (
          <EmptyLine text="Climate records are unreachable right now — the rest of this guide still loads live." />
        ) : !climate ? (
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="img-loading h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {climate.best.map((i) => (
                <span
                  key={i}
                  className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-200 px-4 py-2 text-sm font-bold text-stone-900 shadow"
                >
                  {climate.months[i].label} · {climate.months[i].verdict} · {climate.months[i].reason}
                </span>
              ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-3xl bg-stone-950 p-5 sm:p-7">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
                {climate.months.map((m) => (
                  <MonthCell key={m.m} m={m} isBest={climate.best.includes(m.m)} />
                ))}
              </div>
              <p className="mt-5 text-xs text-white/50">
                Scored live from {climate.years} daily records (Open-Meteo archive): 18–27°C comfort band,
                rain-day and rainfall penalties. Gold months are the top 3 scores.
              </p>
            </div>
          </>
        )}
      </section>

      <section id="dont-miss" className="mt-10 scroll-mt-36">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
          Ranked live from map data
        </p>
        <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-stone-900">Don't miss in {place.name}</h2>
        {!pois && !poisLoading ? (
          <EmptyLine text="Sight data is unreachable right now — the map above still shows everything live." />
        ) : !pois ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="img-loading h-40 rounded-3xl" />
            <div className="img-loading h-40 rounded-3xl" />
          </div>
        ) : dontMiss.length === 0 ? (
          <EmptyLine text="No mapped sights found in this radius right now — the map above still shows everything live." />
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {dontMiss.map((s, i) => (
              <div key={s.id} className="card-lift rounded-3xl border border-stone-200/70 bg-white p-5">
                <div className="flex items-start gap-4">
                  <span className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-stone-900 text-lg font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-stone-900">{s.name}</p>
                    <p className="text-xs font-semibold text-stone-400">
                      {s.km < 1 ? `${Math.round(s.km * 1000)} m` : `${s.km.toFixed(1)} km`} from center
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
                  {blurbs[s.name] || sightLine(s)}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sightChips(s).map((c) => (
                    <span key={c} className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="stay" className="mt-10 scroll-mt-36">
        <SectionHead
          kicker="Live hotel map data"
          title="Where to stay"
          right={poisLoading ? 'Searching live…' : pois ? `${pois.stay.length} mapped within ${pois.radiusKm} km` : 'Unavailable right now'}
        />
        {!pois && !poisLoading ? (
          <EmptyLine text="Hotel data is unreachable right now — try the map above for the wider area." />
        ) : !pois ? (
          <SkeletonRow />
        ) : pois.stay.length === 0 ? (
          <EmptyLine text="No hotels mapped in this radius yet — try the map above for the wider area." />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pois.stay.slice(0, 9).map((p) => (
              <PoiCard key={p.id} p={p} icon={<BuildingIcon className="h-5 w-5" />} />
            ))}
          </div>
        )}
      </section>

      <section id="eat" className="mt-10 scroll-mt-36">
        <SectionHead
          kicker="Live restaurant map data · veg decoded"
          title="Where to eat"
          right={
            poisLoading
              ? 'Searching live…'
              : pois
                ? `${eatList.length} spots · ${vegCounts.only} veg-only · ${vegCounts.friendly} veg-friendly · ${vegCounts.vegan} vegan`
                : 'Unavailable right now'
          }
        />
        {cuisine && (
          <div className="mt-4 flex flex-col gap-5 overflow-hidden rounded-3xl border border-stone-200/70 bg-white p-6 sm:flex-row">
            {cuisine.image && (
              <img
                src={cuisine.image}
                alt={`${country?.name || place.country} cuisine`}
                loading="lazy"
                className="h-44 w-full rounded-2xl object-cover sm:w-64"
              />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                Taste of {country?.name || place.country} · live
              </p>
              <p className="font-display mt-1 text-2xl font-bold text-stone-900">
                {titleCase((cuisine.title || '').replace(/ cuisine$/i, ''))} cuisine
              </p>
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-stone-600">{cuisine.extract}</p>
              <a
                href={cuisine.wikiUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-bold text-emerald-800 hover:underline"
              >
                Read more on Wikipedia ↗
              </a>
            </div>
          </div>
        )}
        {topCuisines.length > 0 && (
          <div className="mt-4 rounded-3xl border border-stone-200/70 bg-white p-6">
            <p className="text-sm font-bold text-stone-800">Cuisines on the streets right now</p>
            <div className="mt-3 space-y-2.5">
              {topCuisines.map(([c, n]) => (
                <div key={c} className="flex items-center gap-3 text-sm">
                  <span className="w-32 shrink-0 truncate font-semibold text-stone-700">{c}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-lime-400"
                      style={{ width: `${Math.max(6, (n / maxCuisine) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-stone-500">×{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ['all', `All · ${eatList.length}`],
            ['only', `Veg only · ${vegCounts.only}`],
            ['friendly', `Veg-friendly · ${vegCounts.only + vegCounts.friendly}`],
            ['vegan', `Vegan · ${vegCounts.vegan}`],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setVegFilter(v)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                vegFilter === v ? 'bg-emerald-950 text-white shadow' : 'bg-white text-stone-500 ring-1 ring-stone-200 hover:text-stone-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {!pois && !poisLoading ? (
          <EmptyLine text="Restaurant data is unreachable right now — try again in a moment." />
        ) : !pois ? (
          <SkeletonRow />
        ) : filteredEat.length === 0 ? (
          <EmptyLine text="No spots match this diet filter in the mapped area — try All." />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEat.slice(0, 12).map((p) => (
              <PoiCard key={p.id} p={p} icon={<UtensilsIcon className="h-5 w-5" />} />
            ))}
          </div>
        )}
      </section>

      <section id="facts" className="mt-10 scroll-mt-36">
        <SectionHead kicker="Derived live, right now" title="Did you know?" right="Random facts engine" />
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Fact label="Local time" value={localTime ? `${localTime} · ${tzShort}` : '…'} />
          <Fact label="Elevation" value={elevM == null ? '…' : `${elevM.toLocaleString()} m`} />
          <Fact label="Sunrise / sunset" value={`${sun(weather?.sunrise)} / ${sun(weather?.sunset)}`} />
          <Fact
            label="Food scene"
            value={pois ? `${eatList.length} eateries · ${vegCounts.only} veg-only` : '…'}
          />
          <Fact label="Sights mapped" value={pois ? `${pois.sights.length} within ${pois.radiusKm} km` : '…'} />
          <Fact label="Stays mapped" value={pois ? `${pois.stay.length} within ${pois.radiusKm} km` : '…'} />
          <Fact
            label="Coordinates"
            value={`${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`}
          />
          <Fact label="Vibe" value={`${place.vibe} · ${place.budget} budget`} />
        </div>
      </section>

      <section id="budget" className="mt-10 scroll-mt-36">
        <SectionHead
          kicker="Editorial estimates, honest ranges"
          title="Plan & budget"
          right={country?.currency ? `Local currency · ${country.currency}` : `${place.budget} tier`}
        />
        <div className="mt-4 rounded-3xl border border-stone-200/70 bg-white p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Sleep / night', budget.sleep, budget.bars[0]],
              ['Eat / meal', budget.eat, budget.bars[1]],
              ['Move / day', budget.move, budget.bars[2]],
            ].map(([label, range, w]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-bold text-stone-500">{label}</p>
                  <p className="font-display text-2xl font-bold text-stone-900">{range}</p>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-800 via-emerald-500 to-amber-300" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-600">
            <span className="font-bold text-stone-800">{place.budget} tier · </span>
            {budget.note} Ranges are editorial estimates for one traveler, excl. flights.
          </p>
        </div>
      </section>

      <h2 className="font-display mt-10 text-2xl font-bold">Nearby escapes</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
        {nearby.map((n) =>
          details[n.id] ? (
            <DestinationCard key={n.id} place={n} summary={details[n.id].summary} weather={details[n.id].weather} />
          ) : (
            <div key={n.id} className="rounded-3xl border bg-white p-5 text-sm text-stone-500">
              Loading {n.name}… ({n.km.toLocaleString()} km away)
            </div>
          )
        )}
      </div>
    </div>
  );
}

function sightLine(s) {
  const bits = [];
  if (s.tourism && s.tourism !== 'attraction') bits.push(titleCase(s.tourism));
  if (s.historic) bits.push(`${titleCase(s.historic)} heritage`);
  if (s.free) bits.push('free entry');
  bits.push(s.km < 1 ? 'a short walk from the center' : `${s.km.toFixed(1)} km from the center`);
  return `Mapped ${bits.join(' · ')} — tap the pin on the map for its exact spot.`;
}

function sightChips(s) {
  const chips = [];
  if (s.tourism && s.tourism !== 'attraction') chips.push(titleCase(s.tourism));
  else chips.push('Sightseeing');
  if (s.historic) chips.push('Historic');
  if (s.free) chips.push('Free entry');
  if (s.website) chips.push('Has website');
  return chips.slice(0, 4);
}

function SectionHead({ kicker, title, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">{kicker}</p>
        <h2 className="font-display mt-1 text-3xl font-bold tracking-tight text-stone-900">{title}</h2>
      </div>
      <p className="rounded-full bg-stone-100 px-3.5 py-1.5 text-xs font-bold text-stone-500">{right}</p>
    </div>
  );
}

function EmptyLine({ text }) {
  return (
    <div className="mt-4 rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
      {text}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="img-loading h-44 rounded-3xl" />
      <div className="img-loading h-44 rounded-3xl" />
      <div className="img-loading h-44 rounded-3xl" />
    </div>
  );
}

function LayerToggle({ on, onClick, color, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        on ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400'
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </button>
  );
}

function PoiPin({ p, color, fill }) {
  return (
    <CircleMarker
      center={[p.lat, p.lng]}
      radius={6}
      pathOptions={{ color, weight: 2, fillColor: fill, fillOpacity: 0.85 }}
    >
      <Popup>
        <strong>{p.name}</strong>
        <br />
        {p.km < 1 ? `${Math.round(p.km * 1000)} m away` : `${p.km.toFixed(1)} km away`}
      </Popup>
    </CircleMarker>
  );
}

function MonthCell({ m, isBest }) {
  return (
    <div
      className={`rounded-2xl p-2.5 text-center transition ${
        isBest ? 'bg-gradient-to-b from-amber-300/25 to-amber-200/10 ring-2 ring-amber-300' : 'bg-white/5'
      }`}
    >
      <p className={`text-xs font-bold ${isBest ? 'text-amber-300' : 'text-white/60'}`}>{m.label}</p>
      <div className="mx-auto mt-2 flex h-20 items-end justify-center gap-1">
        <TempBar t={m.tAvg} />
        <RainBar days={m.rainDays} />
      </div>
      <p className="mt-2 text-sm font-bold text-white">{m.tAvg == null ? '—' : `${Math.round(m.tAvg)}°`}</p>
      <p className={`text-[10px] font-bold ${isBest ? 'text-amber-300' : 'text-white/50'}`}>
        {isBest ? 'BEST · ' : ''}{m.verdict}
      </p>
      <p className="mt-0.5 hidden text-[10px] leading-tight text-white/45 lg:block">{m.reason}</p>
    </div>
  );
}

function TempBar({ t }) {
  const h = t == null ? 8 : Math.min(100, Math.max(12, ((t + 5) / 40) * 100));
  const hot = (t ?? 0) >= 27;
  const cold = (t ?? 20) <= 8;
  const cls = hot
    ? 'from-orange-500 to-amber-300'
    : cold
      ? 'from-sky-500 to-cyan-300'
      : 'from-emerald-500 to-lime-300';
  return <div className={`w-3.5 rounded-full bg-gradient-to-t ${cls}`} style={{ height: `${h}%` }} title={`${t}°C avg`} />;
}

function RainBar({ days }) {
  const h = Math.min(100, 10 + days * 12);
  return <div className="w-1.5 rounded-full bg-sky-400/70" style={{ height: `${h}%` }} title={`${days} wet days`} />;
}

function PoiCard({ p, icon }) {
  const meta =
    p.kind === 'eat'
      ? p.cuisines.slice(0, 2).join(' · ') || 'Local kitchens'
      : p.kind === 'stay'
        ? [p.stars ? `${p.stars}-star` : '', 'Sleep'].filter(Boolean).join(' · ')
        : [p.tourism && p.tourism !== 'attraction' ? titleCase(p.tourism) : 'Sightseeing', p.free ? 'Free entry' : '']
          .filter(Boolean)
          .join(' · ');
  return (
    <div className="card-lift rounded-3xl border border-stone-200/70 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-950 text-white">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold text-stone-900">{p.name}</p>
          <p className="flex items-center gap-1 text-xs font-semibold text-stone-400">
            <MapPinIcon className="h-3 w-3" />
            {meta} · {p.km < 1 ? `${Math.round(p.km * 1000)} m` : `${p.km.toFixed(1)} km`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.kind === 'eat' && (
          <>
            {p.vegOnly && <Badge hot label="Veg only" />}
            {!p.vegOnly && p.vegOptions && <Badge label="Veg options" />}
            {p.vegan && <Badge label="Vegan" />}
            {p.outdoor && <Badge label="Outdoor seating" />}
            {p.takeaway && <Badge label="Takeaway" />}
          </>
        )}
        {p.website ? (
          <a
            href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-stone-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-stone-700"
          >
            Website ↗
          </a>
        ) : null}
      </div>
      {p.hours && <p className="mt-2 text-xs text-stone-400">Hours: {p.hours}</p>}
    </div>
  );
}

function Badge({ label, hot }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
        hot ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
      }`}
    >
      {label}
    </span>
  );
}

function Fact({ label, value, flag }) {
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-stone-800">
        {flag && <img src={flag} alt="" className="h-4 w-6 rounded-sm object-cover" />}
        <span className="line-clamp-1">{value}</span>
      </p>
    </div>
  );
}
