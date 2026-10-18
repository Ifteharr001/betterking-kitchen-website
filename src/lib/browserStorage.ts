const MAX_SESSION_CACHE_SIZE = 512 * 1024;

export function setSessionCache(key: string, value: unknown) {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(value);
    if (serialized.length > MAX_SESSION_CACHE_SIZE) {
      window.sessionStorage.removeItem(key);
      return;
    }

    window.sessionStorage.setItem(key, serialized);
  } catch {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Storage can be unavailable or over quota in restricted browser contexts.
    }
  }
}