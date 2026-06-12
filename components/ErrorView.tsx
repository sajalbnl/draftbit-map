import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';

type ErrorViewProps = {
  message: string;
  onRetry: () => void;
};

/**
 * Full-screen error state with a retry action.
 * Network calls fail in the real world (offline, API down, CORS issues);
 * giving the user a clear message and a way to recover is table stakes.
 */
export default function ErrorView({ message, onRetry }: ErrorViewProps) {
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Couldn&apos;t load locations
      </Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
