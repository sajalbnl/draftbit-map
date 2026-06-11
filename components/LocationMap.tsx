import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import type { LocationMapProps } from '@/components/location-map-props';
import { formatMagnitude, magnitudeColor } from '@/constants/magnitude';

/**
 * NATIVE map implementation (iOS / Android).
 *
 * Uses react-native-maps — the standard RN map library — which renders the
 * real platform map: Apple Maps on iOS, Google Maps on Android.
 *
 * react-native-maps has NO web support (it wraps native iOS/Android SDKs that
 * simply don't exist in a browser). That's why this component has a sibling,
 * LocationMap.web.tsx, with the same props. Metro picks the right file per
 * platform automatically.
 *
 * Interaction: tapping a pin opens its callout (title + hint); tapping the
 * callout navigates to the detail screen via onSelect.
 */
export default function LocationMap({ locations, onSelect }: LocationMapProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      // A wide world view, since earthquakes happen globally.
      initialRegion={{
        latitude: 20,
        longitude: 0,
        latitudeDelta: 100,
        longitudeDelta: 180,
      }}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={`${formatMagnitude(location.magnitude)} — ${location.title}`}
          description="Tap for details"
          pinColor={magnitudeColor(location.magnitude)}
          onCalloutPress={() => onSelect(location.id)}
        />
      ))}
    </MapView>
  );
}
