// src/api/client.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { secureStorage, KEYS } from "../services/secureStorage";
import { BASE_URL } from "../constants/env";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach Bearer token ──────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await secureStorage.get(KEYS.ACCESS_TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 → refresh once ───────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.get(KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${BASE_URL}/api/v1/users/refresh-token`, {
          refreshToken,
        });
        const newToken: string = data.data.accessToken;
        await secureStorage.set(KEYS.ACCESS_TOKEN, newToken);
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await secureStorage.remove(KEYS.ACCESS_TOKEN);
        await secureStorage.remove(KEYS.REFRESH_TOKEN);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Documentation: Axios client configured with automatic 401 token refresh and request queuing to prevent race conditions.
