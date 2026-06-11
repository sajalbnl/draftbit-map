import type { Location } from '@/types/location';

/**
 * USGS "all earthquakes, past 24 hours" feed.
 *
 * Why this API:
 * - Keyless: our web build ships to a public Cloudflare URL, and any API key
 *   bundled into client-side JavaScript is readable by anyone in DevTools.
 *   A keyless source means there is simply no secret to leak.
 * - CORS-enabled: the deployed web app fetches from the user's browser, and
 *   browsers block cross-origin requests unless the API allows them. USGS does.
 * - Live data: the map shows today's real earthquakes on every visit.
 */
const FEED_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

/** The subset of the USGS GeoJSON response this app actually reads. */
type UsgsFeature = {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string | null;
    felt: number | null;
    /** USGS sends 0 or 1, not a boolean. */
    tsunami: number;
  };
  geometry: {
    /** GeoJSON order is [longitude, latitude, depthKm] — longitude FIRST. */
    coordinates: [number, number, number];
  } | null;
};

type UsgsResponse = {
  features: UsgsFeature[];
};

/**
 * Module-level in-memory cache.
 * Both screens share one download per app session: the detail screen looks an
 * event up by id without re-fetching the whole feed. Opening a detail URL
 * directly (deep link / browser refresh) still works — the cache is just
 * empty, so it fetches first.
 */
let cache: Location[] | null = null;

/** Download (or reuse) the feed and return it as clean Location objects. */
export async function fetchLocations(options?: {
  force?: boolean;
}): Promise<Location[]> {
  if (cache && !options?.force) {
    return cache;
  }

  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`USGS request failed (HTTP ${response.status})`);
  }

  const data = (await response.json()) as UsgsResponse;
  const locations = data.features
    .map(parseFeature)
    .filter((location): location is Location => location !== null);

  cache = locations;
  return locations;
}

/** Find a single location by id, fetching the feed first if needed. */
export async function getLocationById(
  id: string
): Promise<Location | undefined> {
  const locations = await fetchLocations();
  return locations.find((location) => location.id === id);
}

/**
 * Convert one raw USGS feature into our clean Location model.
 * Returns null for malformed entries so a single bad record in the feed
 * can never crash the app — it's just skipped.
 */
function parseFeature(feature: UsgsFeature): Location | null {
  const coordinates = feature.geometry?.coordinates;
  if (!coordinates) {
    return null;
  }

  // GeoJSON stores [longitude, latitude, depth] — note longitude comes first.
  // Getting this backwards is the classic GeoJSON bug that puts pins in the ocean.
  const [longitude, latitude, depthKm] = coordinates;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  return {
    id: feature.id,
    title: feature.properties.place ?? 'Unknown location',
    latitude,
    longitude,
    magnitude: feature.properties.mag,
    depthKm: typeof depthKm === 'number' ? depthKm : null,
    time: feature.properties.time,
    tsunami: feature.properties.tsunami === 1,
    url: feature.properties.url,
    feltReports: feature.properties.felt,
  };
}
