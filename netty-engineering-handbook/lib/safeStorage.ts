const memoryStorage = new Map<string, string>();

export function safeGetStorageItem(key: string) {
  if (typeof window === "undefined") return memoryStorage.get(key) ?? null;

  try {
    return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

export function safeSetStorageItem(key: string, value: string) {
  memoryStorage.set(key, value);
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
