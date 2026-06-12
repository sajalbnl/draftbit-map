/**
 * App colour palette, one per theme.
 *
 * The navigation ThemeProvider in app/_layout.tsx already sets each screen's
 * *background* from the OS light/dark setting. These palettes cover the colours
 * that live *on top* of that background — text, muted labels, cards, borders —
 * which were previously hardcoded to light-mode values and went unreadable in
 * dark mode.
 *
 * Centralised here (like constants/magnitude.ts) so every screen stays
 * consistent and a colour only ever changes in one place.
 */
export type ThemeColors = {
  /** Primary foreground text. */
  text: string;
  /** Secondary / label text. */
  textMuted: string;
  /** Surface colour for cards sitting on the screen background. */
  card: string;
  /** Hairline borders and dividers. */
  border: string;
};

export const lightColors: ThemeColors = {
  text: '#111827',
  textMuted: '#6b7280',
  card: '#ffffff',
  border: '#e5e7eb',
};

export const darkColors: ThemeColors = {
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  card: '#1f2937',
  border: '#374151',
};
