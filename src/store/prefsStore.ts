import { create } from "zustand";
import { storage, STORAGE_KEYS } from "../services/storage";

interface PrefsState {
  darkMode: boolean;
  notifGranted: boolean;
  lastActiveAt: number;

  hydrate: () => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  setNotifGranted: (granted: boolean) => Promise<void>;
  updateLastActive: () => Promise<void>;
}

export const usePrefsStore = create<PrefsState>((set, get) => ({
  darkMode: false,
  notifGranted: false,
  lastActiveAt: Date.now(),

  hydrate: async () => {
    try {
      const [darkMode, notifGranted] = await Promise.all([
        storage.get<boolean>(STORAGE_KEYS.DARK_MODE),
        storage.get<boolean>(STORAGE_KEYS.NOTIF_GRANTED),
      ]);
      
      set({
        darkMode: !!darkMode,
        notifGranted: !!notifGranted,
      });
    } catch (err) {
      console.error("Failed to hydrate prefs store", err);
    }
  },

  toggleDarkMode: async () => {
    const newValue = !get().darkMode;
    set({ darkMode: newValue });
    try {
      await storage.set(STORAGE_KEYS.DARK_MODE, newValue);
    } catch (err) {
      set({ darkMode: !newValue }); // revert on failure
    }
  },

  setNotifGranted: async (granted: boolean) => {
    set({ notifGranted: granted });
    await storage.set(STORAGE_KEYS.NOTIF_GRANTED, granted);
  },

  updateLastActive: async () => {
    const now = Date.now();
    set({ lastActiveAt: now });
  }
}));

// Documentation: Tracks global user preferences like dark mode and notification permissions using AsyncStorage.
