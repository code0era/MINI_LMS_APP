// src/types/auth.d.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: { url: string; localPath: string };
  coverImage?: { url: string; localPath: string };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}
