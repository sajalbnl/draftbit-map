import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';

/** Full-screen loading state shown while data is being fetched. */
export default function LoadingView({ message }: { message: string }) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  message: {
    fontSize: 16,
  },
});
