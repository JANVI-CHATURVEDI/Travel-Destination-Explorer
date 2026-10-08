# 🌍 Travel Destination Explorer — Live Edition

> Discover places with **live photos, live weather and live country facts**. No stale hard-coded content.
> Built with **React + Vite + Tailwind + Leaflet + React Router**.

Live demo: `https://travel-destination-explorer-neon.vercel.app/`

## ✨ What it does

- **Premium landing page** with hero, live-API badges and top-rated preview
- **Explore page** (`/explore`) — search + filters (region, vibe, budget, rating) + sort (rating, A–Z, warmest now using live temps). Filters sync to the URL, e.g. `/explore?continent=Asia&sort=temp`
- **Detail pages** (`/explore/:id`, e.g. `/explore/kyoto`) — hero photo, about, country facts, 5-day forecast, interactive map, nearby escapes
- **Interactive map** — auto fit-bounds, click pins for quick links
- **24 curated places** across 6 regions

## 🔌 Live APIs (free, no keys)

| Content | API |
|---|---|
| Photo + description | Wikipedia REST `api/rest_v1/page/summary/{title}` |
| Current + 5-day weather | Open-Meteo `api.open-meteo.com/v1/forecast` |
| Capital + population | CountriesNow `countriesnow.space` (free, keyless) |
| Flags | FlagCDN image CDN `flagcdn.com` |
| Country blurb | Wikipedia summary of the country |

Responses are cached in `sessionStorage` (6h content, 30min weather). If an API fails, the UI degrades gracefully to a picsum fallback image and editorial text.

`src/data/placesIndex.js` holds **only stable IDs + coordinates + editorial tags** (vibe/budget/rating are subjective curation, like Airbnb categories — not factual data). Everything you *see* loads live; see `src/lib/api.js`.

## 🛠 Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview
```

## 🗺 Routes

- `/` — landing
- `/explore` — live explorer (query params: `q, continent, vibe, budget, rating, sort`)
- `/explore/:id` — detail (e.g. `/explore/petra`, `/explore/banff`)

## 📁 Structure

```
src/
  lib/api.js            # Wikipedia / Open-Meteo / REST Countries + cache
  data/placesIndex.js   # IDs + coords + editorial tags only
  hooks/useLivePlaces.js# enrichment hooks (concurrency-limited)
  components/
    Navbar.jsx  Footer.jsx  LandingPage.jsx
    ExplorePage.jsx  FilterBar.jsx  DestinationCard.jsx
    DestinationDetail.jsx  MapView.jsx
```

## 🚀 Next ideas

- Favorites with localStorage · user reviews · itinerary builder
- Marker clustering for 100+ places · PWA offline pack · dark mode
