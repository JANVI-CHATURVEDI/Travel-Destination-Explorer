# Travel Destination Explorer — Live Deep-Guide Edition

> Discover places with **live photos, live weather, live climate, live hotels, restaurants and sights**.
> No stale hard-coded content. Built with **React + Vite + Tailwind CSS + Leaflet + React Router**.

**Live demo:** https://travel-destination-explorer-neon.vercel.app/

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)
![APIs](https://img.shields.io/badge/APIs-5_live-keyless-emerald)

## What it does

**Landing page**
- Cinematic hero with working search, trending chips, live stats and a destinations marquee
- Top-rated places with live Wikipedia photos, rank badges and hover zoom
- Auto-rotating **mood orbit wheel** (pauses on hover) with search at its center, plus an auto-scrolling rail on mobile
- Browse-by-region gradient cards, "how the live data works" section, closing CTA band

**Explorer (`/explore`)**
- Search + filters (region, vibe, budget, rating) + sort (top rated, A–Z, warmest right now using live temps)
- Filters sync to the URL — every view is shareable, e.g. `/explore?continent=Asia&sort=temp`
- Interactive map with auto fit-bounds; hovering a card focuses its pin
- Hovering any card **prefetches** its hotels, restaurants and climate so the detail page opens instantly

**Deep guide (`/explore/:id`, e.g. `/explore/kyoto`)**
- Sticky scroll-spy section nav: Overview · Best time · Don't miss · Stay · Eat · Facts · Budget
- **Best time to visit** — 12-month climate chart scored live from Open-Meteo archive records, top-3 months with data-driven reasons
- **Don't miss Top 5** — sights ranked live from map-data richness, each with a live Wikipedia blurb and why-chips
- **Where to stay** — live hotels/hostels with stars, distance and websites
- **Where to eat** — live restaurants with **Veg only / Veg-friendly / Vegan filters** (real OpenStreetMap diet tags), cuisine bars and a "Taste of {country}" card from Wikipedia
- **Did you know?** — local time, elevation, sunrise/sunset, food-scene and POI counts, coordinates — all derived live
- **Plan & budget** — Sleep/Eat/Move bars with honest editorial ranges plus local currency
- Map with toggleable Stay/Eat/Sights pin layers, Google Maps + Wikipedia links, nearby escapes

**Engineering**
- Custom premium SVG icon system (zero emojis in the UI), Playfair Display + Inter type pairing
- Session-cached API layer with timeouts, retries and fallback hosts — a dead API shows a message, never a blank page
- Error boundary around all routes with a recovery screen

## Live APIs (all free, all keyless)

| Content | API |
|---|---|
| Photos + descriptions + sight blurbs + cuisine articles | Wikipedia REST `api/rest_v1/page/summary/{title}` |
| Current weather + 5-day forecast + timezone + sunrise/sunset | Open-Meteo `api.open-meteo.com/v1/forecast` |
| 12-month climate history for best-time scoring | Open-Meteo `archive-api.open-meteo.com/v1/archive` |
| Elevation | Open-Meteo `api.open-meteo.com/v1/elevation` |
| Hotels, restaurants, sights (+ cuisine, diet, stars, hours tags) | Overpass (OpenStreetMap) with fallback mirror |
| Capital + population + currency | CountriesNow `countriesnow.space` |
| Flags | FlagCDN image CDN `flagcdn.com` |

Responses are cached in `sessionStorage` (content 6h, weather 30min, POIs 24h, climate 7 days).

### What's live vs editorial

`src/data/placesIndex.js` holds **only stable IDs + coordinates + subjective tags** (vibe / budget / rating are curation, like Airbnb categories). Everything factual you see — photos, weather, climate, POIs, facts — loads live. Budget ranges and crowd hints are editorial estimates and labeled as such.

## Run it

Requirements: Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Routes

| Route | Page |
|---|---|
| `/` | Landing |
| `/explore` | Live explorer (params: `q, continent, vibe, budget, rating, sort`) |
| `/explore/:id` | Deep guide (e.g. `/explore/petra`, `/explore/banff`) |

## Project structure

```
src/
  lib/
    api.js        # Wikipedia / Open-Meteo / CountriesNow + cache, retries
    pois.js       # Overpass POI engine (stay / eat / sights, veg + cuisine parsing)
    climate.js    # 12-month best-time scoring engine
  data/
    placesIndex.js  # IDs + coordinates + editorial tags only
  hooks/
    useLivePlaces.js  # enrichment hooks (places, place, climate, POIs, summary, elevation)
  components/
    Navbar.jsx  Footer.jsx  ErrorBoundary.jsx  icons.jsx
    LandingPage.jsx  ExplorePage.jsx  FilterBar.jsx
    DestinationCard.jsx  DestinationDetail.jsx  MapView.jsx
```

## Deployment

Connected to Vercel — every push to `main` auto-deploys. Build command `npm run build`, output `dist/`.

## Roadmap ideas

- Favorites with localStorage · user reviews · 3-day itinerary builder
- Marker clustering at 100+ places · PWA offline pack · dark mode
- Events/festivals section when a keyless source fits

## Author

**JANVI-CHATURVEDI** — https://github.com/JANVI-CHATURVEDI
