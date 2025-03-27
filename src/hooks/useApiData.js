import { useMemo } from "react";

/**
 * Universal Data Fetching Hook
 * @param {Function} fetchQuery - The API query function from Redux Toolkit Query
 * @param {any} params - Parameters to pass to the query function
 * @param {Object} options - Optional settings (e.g., { skip: true })
 * @returns {Object} { data, isLoading, error }
 */
const useApiData = (fetchQuery, params, options = {}) => {
  const result = fetchQuery(params, options);

  // Memoize the result to prevent unnecessary re-renders
  return useMemo(
    () => ({
      data: result?.data,
      isLoading: result?.isLoading,
      error: result?.error,
    }),
    [result]
  );
};

export default useApiData;
