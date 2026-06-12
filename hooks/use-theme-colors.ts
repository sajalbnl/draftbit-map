import { darkColors, lightColors, type ThemeColors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Returns the colour palette for the current OS theme.
 *
 * Screens call this instead of hardcoding hex values, so light/dark mode stays
 * readable everywhere. Falls back to the light palette when the scheme is
 * unknown (null/undefined), matching the navigation theme's own default.
 */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}
