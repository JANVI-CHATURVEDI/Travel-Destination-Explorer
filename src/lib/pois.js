import { sessionCache } from './api';
import { haversineKm } from '../data/placesIndex';

const PRIMARY = 'https://overpass-api.de/api/interpreter';
const FALLBACK = 'https://overpass.kumi.systems/api/interpreter';

const STAY = new Set(['hotel', 'guest_house', 'hostel', 'apartment', 'chalet', 'motel']);
const EAT = new Set(['restaurant', 'cafe', 'fast_food', 'food_court']);

function buildQuery(lat, lng, radiusM) {
  const a = `(around:${radiusM},${lat},${lng})`;
  const stay = [...STAY].join('|');
  const eat = [...EAT].join('|');
  return `[out:json][timeout:30];
(
  node["tourism"~"^(${stay})$"]${a};
  way["tourism"~"^(${stay})$"]${a};
  node["amenity"~"^(${eat})$"]${a};
  way["amenity"~"^(${eat})$"]${a};
  node["tourism"~"^(attraction|museum|artwork|viewpoint|gallery|zoo|aquarium|theme_park)$"]${a};
  way["tourism"~"^(attraction|museum|artwork|viewpoint|gallery|zoo|aquarium|theme_park)$"]${a};
  node["historic"]${a};
  way["historic"]${a};
  node["leisure"~"^(park|garden|beach|nature_reserve)$"]${a};
  way["leisure"~"^(park|garden|beach|nature_reserve)$"]${a};
);
out center 60;`;
}

function classify(tags) {
  if (STAY.has(tags.tourism)) return 'stay';
  if (EAT.has(tags.amenity)) return 'eat';
  if (tags.tourism || tags.historic || tags.leisure) return 'sight';
  return null;
}

function cuisinesOf(tags) {
  return (tags.cuisine || '')
    .split(';')
    .map((s) => s.trim().replace(/_/g, ' '))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

function toPoi(el, origin) {
  const tags = el.tags || {};
  const name = (tags.name || '').trim();
  if (!name || name.length > 80) return null;
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat == null || lng == null) return null;
  const kind = classify(tags);
  if (!kind) return null;
  const veg = (tags['diet:vegetarian'] || '').toLowerCase();
  const vegan = (tags['diet:vegan'] || '').toLowerCase();
  return {
    id: `${el.type}/${el.id}`,
    name,
    lat,
    lng,
    kind,
    km: haversineKm(origin, { lat, lng }),
    cuisines: cuisinesOf(tags),
    vegOnly: veg === 'only',
    vegOptions: veg === 'yes' || veg === 'only' || vegan === 'yes' || vegan === 'only',
    vegan: vegan === 'only' || vegan === 'yes',
    stars: tags.stars || '',
    hours: tags.opening_hours || '',
    outdoor: (tags.outdoor_seating || '').toLowerCase() === 'yes',
    takeaway: (tags.takeaway || '').toLowerCase() === 'yes',
    website: tags.website || tags['contact:website'] || '',
    free: (tags.fee || '').toLowerCase() === 'no',
    historic: tags.historic || '',
    tourism: tags.tourism || '',
    tagCount: Object.keys(tags).length,
  };
}

async function postOverpass(body) {
  const run = async (url) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain, */*',
        },
        body: 'data=' + encodeURIComponent(body),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(t);
    }
  };
  try {
    return await run(PRIMARY);
  } catch {
    await new Promise((r) => setTimeout(r, 800));
    return await run(FALLBACK);
  }
}

export async function fetchPois(place, radiusM = 6000) {
  const key = `pois:${place.id}:${radiusM}`;
  const hit = sessionCache(key, undefined, 1000 * 60 * 60 * 24);
  if (hit) return hit;
  const data = await postOverpass(buildQuery(place.lat, place.lng, radiusM));
  const seen = new Set();
  const stay = [];
  const eat = [];
  const sights = [];
  for (const el of data.elements || []) {
    const p = toPoi(el, place);
    if (!p) continue;
    const dedupe = `${p.kind}:${p.name.toLowerCase()}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    if (p.kind === 'stay' && stay.length < 30) stay.push(p);
    else if (p.kind === 'eat' && eat.length < 60) eat.push(p);
    else if (p.kind === 'sight' && sights.length < 40) sights.push(p);
  }
  const byKm = (a, b) => a.km - b.km;
  stay.sort(byKm);
  eat.sort(byKm);
  sights.sort(byKm);
  const out = { stay, eat, sights, radiusKm: Math.round(radiusM / 1000) };
  return sessionCache(key, out, 1000 * 60 * 60 * 24);
}

export function cuisineBreakdown(eat) {
  const counts = new Map();
  for (const p of eat) {
    for (const c of p.cuisines) counts.set(c, (counts.get(c) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

export function rankSights(sights) {
  const score = (p) => {
    let s = p.tagCount;
    if (p.website) s += 6;
    if (p.tourism === 'museum') s += 5;
    if (p.historic) s += 4;
    if (p.tourism === 'viewpoint') s += 3;
    if (p.free) s += 2;
    return s;
  };
  return [...sights].sort((a, b) => score(b) - score(a)).slice(0, 5);
}
