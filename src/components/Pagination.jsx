import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Adjust for how many page numbers to show
    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift("...");
      pageNumbers.unshift(1);
    }

    if (endPage < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-8 mb-8 space-x-2">
      {/* Back Button */}
      <button
        className={`px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        Back
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 text-sm font-medium rounded-lg ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : page === "..."
              ? "text-gray-500 cursor-default"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          aria-label={page === "..." ? "Ellipsis" : `Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
