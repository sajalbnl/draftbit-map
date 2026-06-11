import type { Location } from '@/types/location';

/**
 * Shared contract for the map component.
 *
 * There are two implementations of <LocationMap />:
 *   - LocationMap.tsx      → iOS / Android (react-native-maps)
 *   - LocationMap.web.tsx  → browser (react-leaflet + OpenStreetMap)
 *
 * Metro (Expo's bundler) automatically resolves the `.web.tsx` file when
 * building for web and the plain `.tsx` file for native. Both implementations
 * accept exactly these props, so the rest of the app never knows or cares
 * which platform it is running on.
 *
 * This type lives in its own file (instead of inside LocationMap.tsx) so the
 * web implementation can import it without the import resolving back to
 * itself via platform resolution.
 */
export type LocationMapProps = {
  /** Locations to render as markers. */
  locations: Location[];
  /** Called with the location id when the user asks for details. */
  onSelect: (id: string) => void;
};
