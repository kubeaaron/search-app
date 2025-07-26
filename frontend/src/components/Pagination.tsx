import React from 'react';

interface Props {
  page: number;
  total: number;
  onPageChange: (p: number) => void;
}

export const Pagination: React.FC<Props> = ({ page, total, onPageChange }) => {
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex justify-center space-x-2 p-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

