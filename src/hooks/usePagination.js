// hooks/usePagination.js
import { useState } from "react";

const usePagination = (initialPage = 1, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return {
    currentPage,
    pageSize,
    handlePageChange,
  };
};

export default usePagination;
