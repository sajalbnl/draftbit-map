import type { ReactNode } from 'react';

/**
 * NATIVE app frame (iOS / Android).
 *
 * On a real device the app already owns the whole screen, so there is nothing
 * to frame — this is a transparent passthrough. The web build uses the sibling
 * AppFrame.web.tsx to render the app inside a centred phone-sized column.
 *
 * Metro resolves this `.tsx` file on native and the `.web.tsx` file on web,
 * exactly like LocationMap.
 */
export default function AppFrame({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
