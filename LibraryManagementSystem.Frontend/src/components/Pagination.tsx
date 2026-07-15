interface PaginationProps {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  pageNumber,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalCount === 0) return null;

  const from = (pageNumber - 1) * pageSize + 1;
  const to = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {from}–{to} of {totalCount}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Previous
        </button>
        <span className="pagination-page">
          Page {pageNumber} of {totalPages}
        </span>
        <button
          type="button"
          className="pagination-btn"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
