import { apiRequest, saveAuth } from './client';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export async function login(data: LoginRequest) {
  const result = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (result.success && result.data) {
    saveAuth(result.data);
  }

  return result;
}

export async function register(data: RegisterRequest) {
  return apiRequest<boolean>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerUserWithRole(data: RegisterRequest, role: string) {
  return apiRequest<boolean>(`/auth/registerUserWithRole?role=${role}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
