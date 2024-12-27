/**
 * apiClient.js
 *
 * Base configuration for API interactions using RTK Query.
 * This handles the base URL, credentials, and headers for all API calls.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../base_url/baseurl";

export const apiClient = createApi({
  reducerPath: "apiClient", // Name of this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Replace with your actual API base URL
    credentials: "include", // Ensures cookies (like HTTP-only tokens) are sent with requests
    prepareHeaders: (headers) => {
      // Add CSRF token to headers if it exists in cookies
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      if (csrfToken) {
        headers.set("X-CSRFToken", csrfToken);
      }
      return headers;
    },
  }),
  endpoints: () => ({}), // Endpoints will be injected by specific API features
});

export default apiClient;
