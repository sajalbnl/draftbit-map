import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

/**
 * WEB app frame (browser / the Cloudflare deployment).
 *
 * The product this MVP is building is a phone app headed for the iOS / Android
 * app stores. react-native-web, left alone, lets every screen fill the browser
 * window, so on a laptop the app sprawls edge-to-edge and reads like a website
 * rather than the app it is.
 *
 * This wrapper renders the whole app inside a centred, phone-width column on a
 * neutral backdrop, so the Cloudflare demo looks like the actual mobile app.
 *
 * It is responsive on purpose: on a viewport already as narrow as a phone
 * (a real handset opening the web build, or a slim browser window) there is
 * nothing to frame, so it falls back to full-bleed. The framing only kicks in
 * when there is extra room around the app.
 */

/** Target width of the simulated phone, in px. ~modern handset logical width. */
const PHONE_WIDTH = 420;
/** Keep a phone-like aspect ratio on tall windows instead of a thin strip. */
const PHONE_MAX_HEIGHT = 900;
/** Below this viewport width, skip the frame and render full-screen. */
const FULL_BLEED_BELOW = 480;

export default function AppFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  // Real phone (or a narrow window): the app should own the whole screen.
  if (width < FULL_BLEED_BELOW) {
    return <>{children}</>;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.phone}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Neutral dark surround so the phone reads as a distinct device, independent
  // of whether the app itself is in light or dark mode.
  backdrop: {
    flex: 1,
    backgroundColor: '#0f1115',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  phone: {
    width: PHONE_WIDTH,
    height: '100%',
    maxHeight: PHONE_MAX_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#5945FD',
    shadowOpacity: 0.45,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
});
