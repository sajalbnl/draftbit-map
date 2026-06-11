/**
 * Clean, app-facing model for a map location.
 *
 * The rest of the app only ever sees this shape — never the raw USGS GeoJSON.
 * If the client later swaps the data source (different API, their own backend),
 * only services/earthquakes.ts changes; every screen and component stays as-is.
 */
export type Location = {
  /** Stable unique id from the data source (USGS event id). */
  id: string;
  /** Human-readable place description, e.g. "12 km N of Ridgecrest, CA". */
  title: string;
  latitude: number;
  longitude: number;
  /** Moment magnitude. Null for the rare events USGS hasn't sized yet. */
  magnitude: number | null;
  /** Depth of the event in kilometres below the surface. */
  depthKm: number | null;
  /** Event time as a Unix epoch in milliseconds. */
  time: number;
  /** True if this event triggered a tsunami flag at USGS. */
  tsunami: boolean;
  /** Link to the official USGS event page. */
  url: string | null;
  /** Number of "Did you feel it?" reports submitted by the public. */
  feltReports: number | null;
};
