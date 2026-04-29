// src/constants/env.ts
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.freeapi.app";

export const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";

export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? "";

export const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
