/**
 * Shared magnitude helpers so the native pins, web circles, and detail screen
 * all use one consistent severity scale.
 */

/** Traffic-light severity colour for a given magnitude. */
export function magnitudeColor(magnitude: number | null): string {
  if (magnitude === null) return '#9ca3af'; // grey — unknown
  if (magnitude >= 5) return '#dc2626'; // red — strong
  if (magnitude >= 3) return '#f59e0b'; // amber — moderate
  return '#16a34a'; // green — minor
}

/** "M 4.6" style label; magnitudes can be missing in the feed. */
export function formatMagnitude(magnitude: number | null): string {
  return magnitude === null ? 'M ?' : `M ${magnitude.toFixed(1)}`;
}

/** Human-readable severity word for the detail screen. */
export function magnitudeLabel(magnitude: number | null): string {
  if (magnitude === null) return 'Unknown';
  if (magnitude >= 5) return 'Strong';
  if (magnitude >= 3) return 'Moderate';
  return 'Minor';
}
