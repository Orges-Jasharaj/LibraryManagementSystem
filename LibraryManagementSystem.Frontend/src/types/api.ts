export interface ApiError {
  errorCode?: string;
  errorMessage?: string;
}

export interface ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ApiError[];
}

export interface PaginationResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export enum ReadingStatus {
  NotStarted = 0,
  Reading = 1,
  Completed = 2,
}

export interface LoginResponse {
  displayName: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  refreshTokenExpiryTime: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: ReadingStatus;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
}

export interface UpdateBookRequest extends CreateBookRequest {
  status: ReadingStatus;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}
