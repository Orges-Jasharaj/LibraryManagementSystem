import { apiRequest } from './client';
import type {
  ChangePasswordRequest,
  PaginationResponse,
  UpdateUserRequest,
  User,
} from '../types/api';

export async function getMyProfile() {
  return apiRequest<User>('/user/me');
}

export async function updateMyProfile(data: UpdateUserRequest) {
  return apiRequest<boolean>('/user/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordRequest) {
  return apiRequest<boolean>('/user/changepassword', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export type UserSortOrder = 'newest' | 'oldest';

export async function getUsers(
  pageNumber = 1,
  pageSize = 10,
  searchTerm = '',
  role = '',
  sortOrder: UserSortOrder = 'newest',
) {
  const search = searchTerm.trim();
  const searchQuery = search ? `&searchTerm=${encodeURIComponent(search)}` : '';
  const roleQuery = role ? `&role=${encodeURIComponent(role)}` : '';
  const sortQuery = `&sortOrder=${encodeURIComponent(sortOrder)}`;
  return apiRequest<PaginationResponse<User>>(
    `/user/GetAllUsers?pageNumber=${pageNumber}&pageSize=${pageSize}${searchQuery}${roleQuery}${sortQuery}`,
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
