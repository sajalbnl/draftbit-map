import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import ErrorView from '@/components/ErrorView';
import LoadingView from '@/components/LoadingView';
import LocationMap from '@/components/LocationMap';
import { useLocations } from '@/hooks/use-locations';

/**
 * Screen 1 — the map.
 *
 * Responsibilities are deliberately thin:
 *   1. Ask the useLocations() hook for data (the hook talks to the service).
 *   2. Render loading / error / success states.
 *   3. Navigate to the detail screen when a marker is selected.
 *
 * Note this file knows nothing about USGS, GeoJSON, react-native-maps or
 * Leaflet — those concerns live in the service and the map component.
 */
export default function MapScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useLocations();

  if (isLoading) {
    return <LoadingView message="Loading earthquakes…" />;
  }

  if (error || !data) {
    return <ErrorView message={error ?? 'No data received'} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <LocationMap
        locations={data}
        onSelect={(id) => router.push(`/location/${id}`)}
      />
      {/* Floating summary badge; pointerEvents="none" lets map gestures pass through. */}
      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeText}>
          {data.length} earthquakes · last 24 hours · source: USGS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    bottom: 46,
    alignSelf: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    zIndex: 1000,
    shadowColor: '#5945FD',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
});
