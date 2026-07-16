import { apiRequest } from './client';
import type {
  Book,
  CreateBookRequest,
  PaginationResponse,
  UpdateBookRequest,
} from '../types/api';

export type BookSortOrder = 'newest' | 'oldest';

export async function getBooks(
  pageNumber = 1,
  pageSize = 8,
  searchTerm = '',
  sortOrder: BookSortOrder = 'newest',
) {
  const search = searchTerm.trim();
  const searchQuery = search ? `&searchTerm=${encodeURIComponent(search)}` : '';
  const sortQuery = `&sortOrder=${encodeURIComponent(sortOrder)}`;
  return apiRequest<PaginationResponse<Book>>(
    `/book?pageNumber=${pageNumber}&pageSize=${pageSize}${searchQuery}${sortQuery}`,
  );
}

export async function createBook(data: CreateBookRequest) {
  return apiRequest<boolean>('/book', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBook(bookId: string, data: UpdateBookRequest) {
  return apiRequest<boolean>(`/book/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBook(bookId: string) {
  return apiRequest<boolean>(`/book/${bookId}`, {
    method: 'DELETE',
  });
}
