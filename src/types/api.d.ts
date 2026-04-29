// src/types/api.d.ts
export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  totalPages: number;
  previousPage: boolean;
  nextPage: boolean;
  totalItems: number;
  currentPageItems: number;
  data: T[];
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export type ApiError = {
  statusCode: number;
  message: string;
  success: false;
};
