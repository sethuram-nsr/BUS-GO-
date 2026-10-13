/**
 * demoMode.ts
 * Lightweight backend health-check.
 * Exported flag `isOffline` tells the rest of the app whether to use mock data.
 */

let _offline: boolean | null = null; // null = not yet checked

/**
 * Pings the backend health endpoint.
 * Caches the result for 30 seconds so we don't spam requests.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', {
      method: 'GET',
      signal: AbortSignal.timeout(2500), // 2.5s timeout
    });
    _offline = !res.ok;
  } catch {
    _offline = true; // server not reachable
  }
  return _offline;
}

/** Returns the cached offline state (true = backend down). */
export function isOffline(): boolean {
  return _offline === true;
}

/** Force-set offline state (useful for testing or after a successful call). */
export function setOffline(value: boolean) {
  _offline = value;
}
