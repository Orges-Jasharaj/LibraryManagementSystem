export const USER_PAGE_SIZE = 7;
export const BOOK_PAGE_SIZE = 10;

export function getPageAfterDelete(pageNumber: number, itemsOnPage: number) {
  if (itemsOnPage > 1) return pageNumber;
  return Math.max(1, pageNumber - 1);
}
