import { sessionCache } from './api';

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmt(d) {
  return d.toISOString().slice(0, 10);
}

function tempScore(t) {
  if (t == null) return 0;
  if (t >= 18 && t <= 27) return 100;
  if (t < 18) return Math.max(0, 100 - (18 - t) * 9);
  return Math.max(0, 100 - (t - 27) * 11);
}

function verdictOf(score) {
  if (score >= 80) return 'Ideal';
  if (score >= 62) return 'Great';
  if (score >= 42) return 'Fine';
  return 'Off-season';
}

function reasonFor(m) {
  const bits = [];
  bits.push(m.tAvg == null ? 'patchy records' : `${Math.round(m.tAvg)}°C avg`);
  if (m.rainDays <= 2) bits.push(`only ${m.rainDays} wet days`);
  else if (m.rainDays <= 6) bits.push(`${m.rainDays} wet days`);
  else bits.push(`${m.rainDays} wet days, pack rain cover`);
  if (m.precip >= 150) bits.push(`${Math.round(m.precip)}mm rain`);
  return bits.join(' · ');
}

export async function fetchClimate(lat, lng) {
  const key = `climate:${lat.toFixed(2)},${lng.toFixed(2)}`;
  const hit = sessionCache(key, undefined, 1000 * 60 * 60 * 24 * 7);
  if (hit) return hit;
  const end = new Date();
  end.setDate(end.getDate() - 2);
  const start = new Date(end.getFullYear() - 1, end.getMonth(), 1);
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}` +
    `&start_date=${fmt(start)}&end_date=${fmt(end)}` +
    `&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  let data;
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } finally {
    clearTimeout(t);
  }
  const times = data.daily?.time || [];
  const means = data.daily?.temperature_2m_mean || [];
  const precs = data.daily?.precipitation_sum || [];
  const buckets = Array.from({ length: 12 }, () => ({ n: 0, t: 0, p: 0, wet: 0 }));
  times.forEach((d, i) => {
    const m = parseInt(d.slice(5, 7), 10) - 1;
    if (m < 0 || m > 11) return;
    const b = buckets[m];
    b.n++;
    if (typeof means[i] === 'number') b.t += means[i];
    const pr = typeof precs[i] === 'number' ? precs[i] : 0;
    b.p += pr;
    if (pr >= 1) b.wet++;
  });
  const months = buckets.map((b, m) => {
    const tAvg = b.n ? b.t / b.n : null;
    const score = Math.round(tempScore(tAvg) * 0.65 + Math.max(0, 100 - b.wet * 11 - b.p * 0.35) * 0.35);
    const month = {
      m,
      label: LABELS[m],
      tAvg: tAvg == null ? null : Math.round(tAvg * 10) / 10,
      precip: Math.round(b.p),
      rainDays: b.wet,
      days: b.n,
      thin: b.n < 20,
      score,
      verdict: verdictOf(score),
    };
    month.reason = reasonFor(month);
    return month;
  });
  const ranked = [...months].filter((x) => !x.thin).sort((a, b) => b.score - a.score);
  const best = ranked.slice(0, 3).map((x) => x.m);
  const out = { months, best, years: `${start.getFullYear()}–${end.getFullYear()}` };
  return sessionCache(key, out, 1000 * 60 * 60 * 24 * 7);
}
