import { apiRequest } from './client';
import type { PaginationResponse, UpdateUserRequest, User } from '../types/api';

export async function getUsers(pageNumber = 1, pageSize = 10) {
  return apiRequest<PaginationResponse<User>>(
    `/user/GetAllUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
}

export async function updateUser(userId: string, data: UpdateUserRequest) {
  return apiRequest<boolean>(`/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deactivateUser(userId: string) {
  return apiRequest<boolean>(`/user/${userId}`, {
    method: 'DELETE',
  });
}

export async function reactivateUser(userId: string) {
  return apiRequest<boolean>(`/user/ReactivateUser/${userId}`, {
    method: 'PUT',
  });
}

export async function updateUserRole(userId: string, role: string) {
  return apiRequest<boolean>(`/user/${userId}/role?role=${role}`, {
    method: 'PUT',
  });
}
