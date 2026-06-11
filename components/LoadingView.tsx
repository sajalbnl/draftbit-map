import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/** Full-screen loading state shown while data is being fetched. */
export default function LoadingView({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>{message}</Text>
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
    color: '#6b7280',
  },
});
