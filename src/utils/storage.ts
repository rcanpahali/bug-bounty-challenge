import { STORAGE_KEYS } from "../storage/keys";

export type TStorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function safeJsonParse<T>(value: string | null | undefined): T | null {
  if (value == null) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error("Failed to parse storage item", { value });

    return null;
  }
}

export function getStorageItem<T>(key: TStorageKey): T | null {
  return safeJsonParse<T>(localStorage.getItem(key));
}
