import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Root layout — expo-router wraps every screen in this component.
 *
 * The app is a simple two-screen stack:
 *   /               → app/index.tsx          (map)
 *   /location/[id]  → app/location/[id].tsx  (detail)
 *
 * File-based routing means the file tree IS the navigation structure, and on
 * web each screen automatically gets a real, shareable URL — which is exactly
 * what the Cloudflare deployment needs.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Earthquakes · last 24h' }}
        />
        <Stack.Screen name="location/[id]" options={{ title: 'Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
