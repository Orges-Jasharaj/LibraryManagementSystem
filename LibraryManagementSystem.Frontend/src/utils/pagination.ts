export const PAGE_SIZE = 8;

export function getPageAfterDelete(pageNumber: number, itemsOnPage: number) {
  if (itemsOnPage > 1) return pageNumber;
  return Math.max(1, pageNumber - 1);
}
