import React from 'react';

interface Props {
  page: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<Props> = ({ page, total, onPageChange }) => {
  const totalPages = Math.ceil(total / 10); // Assuming 10 results per page

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-blue-600 text-sm flex items-center h-full">{`Page ${page} of ${totalPages}`}</span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || totalPages === 0}
        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

