import { Link } from 'react-router-dom';
import { weatherLabel } from '../lib/api';
import { StarIcon, WeatherIcon, WindIcon } from './icons';

const FALLBACK_IMG = 'https://picsum.photos/seed/travel/800/600';

export function budgetStyle(budget) {
  if (budget === 'Low') return 'bg-emerald-100 text-emerald-800';
  if (budget === 'Medium') return 'bg-amber-100 text-amber-800';
  return 'bg-rose-100 text-rose-800';
}

export default function DestinationCard({ place, summary, weather }) {
  const img = summary?.image || FALLBACK_IMG + `-${place.id}`;
  const temp = weather?.current?.temp;
  const code = weather?.current?.code;
  const blurb = summary?.extract
    ? summary.extract.split('. ').slice(0, 2).join('. ') + '.'
    : 'Live description loading…';

  return (
    <Link
      to={`/explore/${place.id}`}
      className="card-lift group overflow-hidden rounded-3xl border border-stone-200/70 bg-white"
    >
      <div className="relative h-52 overflow-hidden bg-stone-200">
        <img
          src={img}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            if (!e.currentTarget.src.includes('picsum')) e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-stone-800"><StarIcon className="h-3.5 w-3.5 text-amber-500" /> {place.rating.toFixed(1)}</span>
          {typeof temp === 'number' && (
            <span className="flex items-center gap-1.5 rounded-full bg-stone-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <WeatherIcon code={code} className="h-3.5 w-3.5" /> {Math.round(temp)}°C
            </span>
          )}
        </div>
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${budgetStyle(place.budget)}`}>
          {place.budget}
        </span>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">{place.continent}</p>
            <h3 className="font-display text-2xl font-bold text-white drop-shadow">{place.name}</h3>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-emerald-700">{place.vibe}</p>
        <p className="mt-1 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-stone-600">{blurb}</p>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
          <span className="flex items-center gap-1.5 text-stone-500">
            {typeof temp === 'number' ? (
              <>{weatherLabel(code)} <WindIcon className="h-3.5 w-3.5" /> {weather?.current?.wind ?? '—'} km/h</>
            ) : (
              'Fetching live weather…'
            )}
          </span>
          <span className="font-bold text-emerald-900 transition group-hover:translate-x-1">Details →</span>
        </div>
      </div>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white">
      <div className="img-loading h-52 w-full" />
      <div className="space-y-3 p-5">
        <div className="img-loading h-4 w-1/3 rounded" />
        <div className="img-loading h-4 w-full rounded" />
        <div className="img-loading h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}
