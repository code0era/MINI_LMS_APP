import { create } from "zustand";
import { secureStorage, KEYS } from "../services/secureStorage";
import { storage, STORAGE_KEYS } from "../services/storage";
import { loginApi, registerApi, logoutApi, currentUserApi } from "../api/auth";
import type { User, LoginPayload, RegisterPayload } from "../types/auth";
import { api } from "../api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: Omit<RegisterPayload, "role">) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  hydrate: async () => {
    try {
      const token = await secureStorage.get(KEYS.ACCESS_TOKEN);
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }

      // We have a token, fetch current user
      const user = await currentUserApi();
      await storage.set(STORAGE_KEYS.USER, user);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      // If 401, the interceptor would try to refresh.
      // If that fails, it will clear tokens.
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, refreshToken, user } = await loginApi(payload);
      
      await secureStorage.set(KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.set(KEYS.REFRESH_TOKEN, refreshToken);
      await storage.set(STORAGE_KEYS.USER, user);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed. Please try again.",
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Register the user
      await registerApi({
        ...payload,
        role: "USER",
      });

      // 2. Automatically log them in to get tokens
      const { accessToken, refreshToken, user } = await loginApi({
        email: payload.email,
        password: payload.password,
      });
      
      await secureStorage.set(KEYS.ACCESS_TOKEN, accessToken);
      await secureStorage.set(KEYS.REFRESH_TOKEN, refreshToken);
      await storage.set(STORAGE_KEYS.USER, user);
      
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      console.error("Registration Error:", err.response?.data || err.message);
      set({
        error: err.response?.data?.message || "Registration failed. Please try again.",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
    } catch (err) {
      // Ignore API errors on logout, we still want to clear local state
    } finally {
      await secureStorage.remove(KEYS.ACCESS_TOKEN);
      await secureStorage.remove(KEYS.REFRESH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER);
      
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));

// Documentation: Zustand store managing authentication state, securely hydrating tokens from expo-secure-store.
