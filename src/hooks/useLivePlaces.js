import { useEffect, useRef, useState } from 'react';
import { fetchElevation, fetchPlaceSummary, fetchWeather } from '../lib/api';
import { fetchClimate } from '../lib/climate';
import { fetchPois } from '../lib/pois';

export function useLivePlaces(places, { enabled = true, concurrency = 4 } = {}) {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(enabled);
  const seq = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const runId = ++seq.current;
    setLoading(true);
    let cancelled = false;
    const queue = [...places];
    const out = {};

    async function worker() {
      while (queue.length && !cancelled) {
        const p = queue.shift();
        try {
          const [summary, weather] = await Promise.all([
            fetchPlaceSummary(p.wikiTitle).catch(() => null),
            fetchWeather(p.lat, p.lng).catch(() => null),
          ]);
          out[p.id] = { summary, weather };
        } catch {
          out[p.id] = { summary: null, weather: null, error: true };
        }
        if (!cancelled && runId === seq.current) setDetails({ ...out });
      }
    }

    (async () => {
      await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
      if (!cancelled && runId === seq.current) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, places, concurrency]);

  return { details, loading };
}

export function useLivePlace(place) {
  const [state, setState] = useState({ loading: !!place, summary: null, weather: null });
  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    setState({ loading: true, summary: null, weather: null });
    fetchPlaceSummary(place.wikiTitle)
      .catch(() => null)
      .then((summary) => {
        if (!cancelled) setState((s) => ({ ...s, summary }));
      });
    fetchWeather(place.lat, place.lng)
      .catch(() => null)
      .then((weather) => {
        if (!cancelled) setState((s) => ({ loading: false, summary: s.summary, weather }));
      });
    return () => {
      cancelled = true;
    };
  }, [place]);
  return state;
}

export function useClimate(place) {
  const [state, setState] = useState({ loading: !!place, climate: null });
  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    fetchClimate(place.lat, place.lng)
      .catch(() => null)
      .then((climate) => {
        if (!cancelled) setState({ loading: false, climate });
      });
    return () => {
      cancelled = true;
    };
  }, [place]);
  return state;
}

export function usePois(place, radiusM = 6000) {
  const [state, setState] = useState({ loading: !!place, pois: null });
  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    fetchPois(place, radiusM)
      .catch(() => null)
      .then((pois) => {
        if (!cancelled) setState({ loading: false, pois });
      });
    return () => {
      cancelled = true;
    };
  }, [place]);
  return state;
}

export function useSummary(title) {
  const [state, setState] = useState({ loading: !!title, summary: null });
  useEffect(() => {
    if (!title) return;
    let cancelled = false;
    fetchPlaceSummary(title)
      .catch(() => null)
      .then((summary) => {
        if (!cancelled) setState({ loading: false, summary });
      });
    return () => {
      cancelled = true;
    };
  }, [title]);
  return state;
}

export function useElevation(place) {
  const [meters, setMeters] = useState(null);
  useEffect(() => {
    if (!place) return;
    let cancelled = false;
    fetchElevation(place.lat, place.lng)
      .catch(() => null)
      .then((m) => {
        if (!cancelled) setMeters(m);
      });
    return () => {
      cancelled = true;
    };
  }, [place]);
  return meters;
}
