// src/services/secureStorage.ts
import * as SecureStore from "expo-secure-store";

/**
 * Thin wrapper around expo-secure-store.
 * If ever swapping to another encrypted store, change only this file.
 */
export const secureStorage = {
  set: (key: string, value: string): Promise<void> =>
    SecureStore.setItemAsync(key, value),

  get: (key: string): Promise<string | null> =>
    SecureStore.getItemAsync(key),

  remove: (key: string): Promise<void> =>
    SecureStore.deleteItemAsync(key),
};

export const KEYS = {
  ACCESS_TOKEN: "cw_access_token",
  REFRESH_TOKEN: "cw_refresh_token",
} as const;
