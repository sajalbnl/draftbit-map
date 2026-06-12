import { useCallback, useEffect, useState } from 'react';

import {
  fetchLocations,
  getCachedLocationById,
  getLocationById,
} from '@/services/earthquakes';
import type { Location } from '@/types/location';

/**
 * Data-fetching hook for the map screen.
 *
 * Screens never call fetch() directly — they use this hook, which delegates
 * to the service layer. That separation means:
 * - loading / error / retry logic is written once, not per screen
 * - the data source can be swapped without touching any UI code
 * - the hook is easy to test in isolation
 */
export function useLocations() {
  const [data, setData] = useState<Location[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchLocations({ force }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load on mount.
  useEffect(() => {
    load(false);
  }, [load]);

  // Retry / pull-fresh-data action exposed to the UI (bypasses the cache).
  const refetch = useCallback(() => load(true), [load]);

  return { data, isLoading, error, refetch };
}

/**
 * Data hook for the detail screen: resolves a single location by id.
 * Uses the service cache, so navigating from the map is instant; deep-linking
 * straight to a detail URL triggers one fetch first.
 */
export function useLocation(id: string | undefined) {
  // Seed from the in-memory cache on first render. When the user came from the
  // map the feed is already loaded, so the detail shows immediately with no
  // spinner flash. Deep-linking straight to this URL finds an empty cache, so
  // these start null/loading and the effect below fetches.
  const cached = id ? getCachedLocationById(id) : undefined;
  const [location, setLocation] = useState<Location | null>(cached ?? null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard against setting state after the screen unmounts mid-fetch.
    let isActive = true;

    async function load() {
      if (!id) {
        setError('No location id provided');
        setIsLoading(false);
        return;
      }
      // Already resolved synchronously from the cache — nothing to fetch.
      if (getCachedLocationById(id)) {
        return;
      }
      try {
        const result = await getLocationById(id);
        if (!isActive) return;
        if (!result) {
          setError('Location not found — it may have dropped out of the 24h feed.');
        } else {
          setLocation(result);
        }
      } catch (e) {
        if (isActive) {
          setError(e instanceof Error ? e.message : 'Something went wrong');
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, [id]);

  return { location, isLoading, error };
}
