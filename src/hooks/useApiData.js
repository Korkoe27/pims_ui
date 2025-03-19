import { useMemo, useEffect } from "react";

/**
 * Universal Data Fetching Hook with Logging
 * @param {Function} fetchQuery - The API query function from Redux Toolkit Query
 * @param {any} params - Parameters to pass to the query function
 * @param {Object} options - Optional settings (e.g., { skip: true })
 * @returns {Object} { data, isLoading, error }
 */
const useApiData = (fetchQuery, params, options = {}) => {
  const result = fetchQuery(params, options);

  // Logging for debugging
  useEffect(() => {
    console.log(`🔍 Fetching data for:`, fetchQuery.name);
    console.log(`📡 Request Params:`, params);
    
    if (result?.isLoading) {
      console.log("⏳ Loading...");
    }

    if (result?.data) {
      console.log("✅ Data Fetched:", result.data);
    }

    if (result?.error) {
      console.error("🚨 Fetch Error:", result.error);
    }
  }, [result, fetchQuery, params]);

  // Memoize the result to prevent unnecessary re-renders
  return useMemo(() => ({
    data: result?.data,
    isLoading: result?.isLoading,
    error: result?.error,
  }), [result]);
};

export default useApiData;

