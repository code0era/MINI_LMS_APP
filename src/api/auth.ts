// src/api/auth.ts
import { api } from "./client";
import type { ApiResponse } from "../types/api";
import type { TokenResponse, User, LoginPayload, RegisterPayload } from "../types/auth";

export async function loginApi(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/users/login",
    payload
  );
  return data.data;
}

export async function registerApi(payload: RegisterPayload) {
  const { data } = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/users/register",
    payload
  );
  return data.data;
}

export async function logoutApi() {
  await api.post("/api/v1/users/logout");
}

export async function currentUserApi() {
  const { data } = await api.get<ApiResponse<User>>(
    "/api/v1/users/current-user"
  );
  return data.data;
}

export async function refreshTokenApi(refreshToken: string) {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
    "/api/v1/users/refresh-token",
    { refreshToken }
  );
  return data.data.accessToken;
}

// Documentation: Handles all authentication related API calls including login, register, and token refresh.
