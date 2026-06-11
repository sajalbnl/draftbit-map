import 'leaflet/dist/leaflet.css';

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

import type { LocationMapProps } from '@/components/location-map-props';
import { formatMagnitude, magnitudeColor } from '@/constants/magnitude';

/**
 * WEB map implementation (browser / the Cloudflare deployment).
 *
 * react-native-maps cannot run in a browser, so on web we render Leaflet with
 * free OpenStreetMap tiles instead — no API key required, which matters
 * because this bundle is publicly served and client-side keys are extractable.
 *
 * Markers are SVG circles (CircleMarker) rather than image pins for two
 * reasons:
 * 1. Leaflet's default pin icons rely on image assets whose paths break under
 *    bundlers — a well-known papercut. Circles avoid asset loading entirely.
 * 2. Circles can encode data: radius scales with magnitude and colour shows
 *    severity, which suits earthquake data better than identical pins.
 *
 * Same props as LocationMap.tsx — Metro picks this file automatically when
 * bundling for web.
 */

/** Bigger quake → bigger circle, clamped so extremes stay tappable/visible. */
function markerRadius(magnitude: number | null): number {
  const m = magnitude ?? 0;
  return Math.max(4, Math.min(18, 4 + m * 2.5));
}

export default function LocationMap({ locations, onSelect }: LocationMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => {
        const color = magnitudeColor(location.magnitude);
        return (
          <CircleMarker
            key={location.id}
            center={[location.latitude, location.longitude]}
            radius={markerRadius(location.magnitude)}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 1 }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>
                  {formatMagnitude(location.magnitude)} — {location.title}
                </strong>
                <br />
                <button
                  onClick={() => onSelect(location.id)}
                  style={{
                    marginTop: 8,
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: 6,
                    background: '#2563eb',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  View details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
