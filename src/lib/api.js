export const sessionCache = (key, value, ttlMs = 1000 * 60 * 60 * 6) => {
  try {
    if (value === undefined) {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { storedAt, data } = JSON.parse(raw);
      if (Date.now() - storedAt > ttlMs) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data;
    }
    sessionStorage.setItem(key, JSON.stringify({ storedAt: Date.now(), data: value }));
    return value;
  } catch {
    return value === undefined ? null : value;
  }
};

async function fetchJson(url, { timeoutMs = 10000, ...opts } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, ...opts });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function postJson(url, body, retries = 1) {
  try {
    return await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      timeoutMs: 12000,
    });
  } catch (e) {
    if (retries > 0) return postJson(url, body, retries - 1);
    throw e;
  }
}

export async function fetchPlaceSummary(wikiTitle, retries = 1) {
  const key = `wiki:${wikiTitle}`;
  const hit = sessionCache(key);
  if (hit) return hit;
  let data;
  try {
    data = await fetchJson(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
    );
  } catch (e) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1200));
      return fetchPlaceSummary(wikiTitle, retries - 1);
    }
    throw e;
  }
  const slim = {
    title: data.title,
    description: data.description || '',
    extract: data.extract || '',
    image: data.originalimage?.source || data.thumbnail?.source || null,
    thumb: data.thumbnail?.source || data.originalimage?.source || null,
    wikiUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`,
  };
  return sessionCache(key, slim);
}

export async function fetchWeather(lat, lng, retries = 2) {
  const key = `wx:${lat.toFixed(2)},${lng.toFixed(2)}`;
  const hit = sessionCache(key, undefined, 1000 * 60 * 30);
  if (hit) return hit;
  let data;
  try {
    data = await fetchJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto&forecast_days=5`,
      { timeoutMs: 15000 }
    );
  } catch (e) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return fetchWeather(lat, lng, retries - 1);
    }
    throw e;
  }
  const slim = {
    current: {
      temp: data.current?.temperature_2m,
      code: data.current?.weather_code,
      wind: data.current?.wind_speed_10m,
      humidity: data.current?.relative_humidity_2m,
      time: data.current?.time,
    },
    tz: data.timezone || '',
    utcOffset: data.utc_offset_seconds ?? 0,
    sunrise: data.daily?.sunrise?.[0] || '',
    sunset: data.daily?.sunset?.[0] || '',
    daily: (data.daily?.time || []).map((date, i) => ({
      date,
      tMax: data.daily.temperature_2m_max?.[i],
      tMin: data.daily.temperature_2m_min?.[i],
      code: data.daily.weather_code?.[i],
    })),
  };
  return sessionCache(key, slim);
}

export async function fetchCountryFacts(countryName, countryCode) {
  const key = `country:${countryCode}`;
  const hit = sessionCache(key);
  if (hit) return hit;
  const [capitalRes, popRes, currencyRes, wiki] = await Promise.all([
    postJson('https://countriesnow.space/api/v0.1/countries/capital', { country: countryName }).catch(() => null),
    postJson('https://countriesnow.space/api/v0.1/countries/population', { country: countryName }).catch(() => null),
    postJson('https://countriesnow.space/api/v0.1/countries/currency', { country: countryName }).catch(() => null),
    fetchPlaceSummary(countryName).catch(() => null),
  ]);
  const counts = popRes?.data?.populationCounts || [];
  const latestPop = counts.length ? counts[counts.length - 1].value : null;
  const slim = {
    name: countryName,
    capital: capitalRes?.data?.capital || '—',
    currency: currencyRes?.data?.currency || '',
    population: latestPop,
    flag: `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`,
    about: wiki?.extract ? wiki.extract.split('. ').slice(0, 2).join('. ') + '.' : '',
    wikiUrl: wiki?.wikiUrl || null,
  };
  return sessionCache(key, slim);
}

export function weatherLabel(code) {
  const map = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
    75: 'Heavy snow', 80: 'Showers', 81: 'Rain showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Storm + hail', 99: 'Severe storm',
  };
  return map[code] ?? '—';
}

export async function fetchElevation(lat, lng) {
  const key = `elev:${lat.toFixed(2)},${lng.toFixed(2)}`;
  const hit = sessionCache(key);
  if (hit !== null && hit !== undefined) return hit;
  const data = await fetchJson(
    `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`
  );
  const m = Array.isArray(data.elevation) ? data.elevation[0] : null;
  return sessionCache(key, typeof m === 'number' ? Math.round(m) : null);
}
