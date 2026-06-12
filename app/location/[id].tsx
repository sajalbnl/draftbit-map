import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ErrorView from '@/components/ErrorView';
import LoadingView from '@/components/LoadingView';
import {
  formatMagnitude,
  magnitudeColor,
  magnitudeLabel,
} from '@/constants/magnitude';
import { useLocation } from '@/hooks/use-locations';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { ThemeColors } from '@/constants/colors';

/**
 * Screen 2 — location detail. Route: /location/[id]
 *
 * Only the id travels in the URL (never a whole serialized object — that's an
 * anti-pattern: params are strings, they hit URL length limits, and stale
 * copies drift from the source of truth). The screen resolves the id through
 * the service-layer cache, so arriving from the map costs no extra network
 * call, while deep-linking straight to this URL still works via one fetch.
 */
export default function LocationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { location, isLoading, error } = useLocation(id);
  const colors = useThemeColors();

  if (isLoading) {
    return <LoadingView message="Loading details…" />;
  }

  if (error || !location) {
    return (
      <ErrorView
        message={error ?? 'Location not found'}
        // The feed is time-windowed (24h), so the real fix is going back to
        // the map, which refetches the current list.
        onRetry={() => router.replace('/')}
      />
    );
  }

  const color = magnitudeColor(location.magnitude);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Set the header title to the place name dynamically. */}
      <Stack.Screen options={{ title: location.title }} />

      <View style={[styles.magnitudeBadge, { backgroundColor: color }]}>
        <Text style={styles.magnitudeText}>
          {formatMagnitude(location.magnitude)}
        </Text>
        <Text style={styles.magnitudeWord}>
          {magnitudeLabel(location.magnitude)}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{location.title}</Text>

      {location.tsunami && (
        <View style={styles.tsunamiBanner}>
          <Text style={styles.tsunamiText}>⚠ Tsunami flag raised by USGS</Text>
        </View>
      )}

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <DetailRow
          label="Time"
          value={new Date(location.time).toLocaleString()}
          colors={colors}
        />
        <DetailRow
          label="Depth"
          value={
            location.depthKm !== null ? `${location.depthKm.toFixed(1)} km` : 'Unknown'
          }
          colors={colors}
        />
        <DetailRow
          label="Coordinates"
          value={`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          colors={colors}
        />
        <DetailRow
          label="Felt reports"
          value={
            location.feltReports !== null ? String(location.feltReports) : 'None submitted'
          }
          colors={colors}
        />
      </View>

      {location.url && (
        <Pressable
          style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
          onPress={() => Linking.openURL(location.url!)}
        >
          <Text style={styles.linkButtonText}>View full report on USGS ↗</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

/** Small presentational helper for label/value rows. */
function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  magnitudeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  magnitudeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  magnitudeWord: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  tsunamiBanner: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
  },
  tsunamiText: {
    color: '#92400e',
    fontWeight: '600',
  },
  // Colour (backgroundColor / borderColor) is applied inline from the theme
  // palette so these surfaces stay readable in both light and dark mode.
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  linkButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  linkButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
