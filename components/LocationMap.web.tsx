import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import type { LocationMapProps } from '@/components/location-map-props';
import { brand } from '@/constants/colors';
import { formatMagnitude, magnitudeColor } from '@/constants/magnitude';

/**
 * WEB map implementation (browser / the Cloudflare deployment).
 *
 * react-native-maps cannot run in a browser, so on web we render Leaflet with
 * free OpenStreetMap tiles instead — no API key required, which matters
 * because this bundle is publicly served and client-side keys are extractable.
 *
 * Markers are teardrop pins to match the native iOS/Android map (which uses
 * react-native-maps' platform pins). We build them with an inline-SVG
 * `divIcon` rather than Leaflet's default image-based pin icon: those icons
 * load PNGs by URL, whose paths break under Metro/bundlers — a well-known
 * papercut. An inline SVG ships no image assets, so it bundles cleanly while
 * still encoding severity via colour, like the native pins.
 *
 * Same props as LocationMap.tsx — Metro picks this file automatically when
 * bundling for web.
 */

/** Teardrop map pin, coloured by severity — mirrors the native pin shape. */
function pinIcon(magnitude: number | null): L.DivIcon {
  const color = magnitudeColor(magnitude);
  return L.divIcon({
    className: '', // strip Leaflet's default styling so only our SVG shows
    html: `
      <svg width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 0C5.82 0 0 5.82 0 13c0 9.25 13 25 13 25s13-15.75 13-25C26 5.82 20.18 0 13 0z"
              fill="${color}" stroke="#ffffff" stroke-width="1.5" />
        <circle cx="13" cy="13" r="4.5" fill="#ffffff" />
      </svg>`,
    iconSize: [26, 38],
    iconAnchor: [13, 38], // tip of the teardrop sits on the coordinate
    popupAnchor: [0, -34], // popup opens just above the pin
  });
}

/**
 * True only on devices with a real pointer that can hover (mouse/trackpad).
 */
const canHover =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover)').matches;

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
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={pinIcon(location.magnitude)}
          eventHandlers={
            canHover ? { mouseover: (e) => e.target.openPopup() } : undefined
          }
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
                  background: brand.primary,
                  color: brand.onPrimary,
                  cursor: 'pointer',
                }}
              >
                View details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
