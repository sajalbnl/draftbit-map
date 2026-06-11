# draftbit-map-app

A two-screen, cross-platform (iOS / Android / Web) earthquake map built with
**Expo SDK 54**, **TypeScript**, and **expo-router**, deployed to a
**Cloudflare Worker**.

- **Map screen** — every earthquake recorded worldwide in the last 24 hours,
  plotted live from the [USGS GeoJSON feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).
  Markers are colour-coded by magnitude.
- **Detail screen** (`/location/[id]`) — magnitude, time, depth, coordinates,
  felt reports, tsunami flag, and a link to the official USGS event page.

## Run it locally

```bash
npm install
npx expo start
```

- press `w` for web
- scan the QR code with **Expo Go** for iOS/Android
  (Expo Go must match SDK 54 — older builds are available at [expo.dev/go](https://expo.dev/go))

## Architecture

```
app/                     expo-router screens (file tree = navigation)
  _layout.tsx            root stack
  index.tsx              map screen            →  /
  location/[id].tsx      detail screen         →  /location/:id
components/
  LocationMap.tsx        map for iOS/Android   (react-native-maps)
  LocationMap.web.tsx    map for the browser   (react-leaflet + OpenStreetMap)
  location-map-props.ts  the shared contract both implementations satisfy
  LoadingView.tsx        full-screen loading state
  ErrorView.tsx          full-screen error state with retry
hooks/
  use-locations.ts       loading / error / data / refetch state for screens
services/
  earthquakes.ts         fetch + parse USGS GeoJSON → clean Location[], cached
types/
  location.ts            the app-facing Location model
constants/
  magnitude.ts           shared severity colours / labels
wrangler.jsonc           Cloudflare Worker config (static assets, SPA fallback)
```

**Layering rule:** screens → hooks → service → API. Screens never fetch
directly and never see raw GeoJSON, so the data source can be swapped by
editing one file (`services/earthquakes.ts`).

**The platform split:** `react-native-maps` wraps native iOS/Android map SDKs
and has no web support. Metro resolves `LocationMap.web.tsx` (Leaflet) when
bundling for web and `LocationMap.tsx` (react-native-maps) for native. Both
implement the same props, so no other file is platform-aware.

## Deploy to Cloudflare

```bash
npx wrangler login   # once
npm run deploy       # = expo export --platform web && wrangler deploy
```

The exported `dist/` folder is served as static assets by a Cloudflare Worker.
`not_found_handling: "single-page-application"` in `wrangler.jsonc` makes deep
links like `/location/us7000abcd` serve `index.html` so expo-router can handle
routing client-side.

## Useful scripts

| command             | what it does                              |
| ------------------- | ----------------------------------------- |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`)         |
| `npm run lint`      | ESLint via `expo lint`                    |
| `npm run build:web` | export the static web build into `dist/`  |
| `npm run deploy`    | build + deploy to Cloudflare              |
