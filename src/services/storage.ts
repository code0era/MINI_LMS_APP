// src/services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Thin wrapper around AsyncStorage for non-sensitive app data.
 * Swap to MMKV here if you want better performance (bonus points).
 */
export const storage = {
  set: async (key: string, value: unknown): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  get: async <T>(key: string): Promise<T | null> => {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  remove: (key: string): Promise<void> => AsyncStorage.removeItem(key),

  clear: (): Promise<void> => AsyncStorage.clear(),
};

export const STORAGE_KEYS = {
  COURSES_CACHE: "cw_courses_cache",
  COURSES_CACHE_TS: "cw_courses_cache_ts",
  BOOKMARKS: "cw_bookmarks",
  ENROLLED: "cw_enrolled",
  USER: "cw_user",
  DARK_MODE: "cw_dark_mode",
  NOTIF_GRANTED: "cw_notif_granted",
  INACTIVITY_ID: "cw_inactivity_notif_id",
} as const;
