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
