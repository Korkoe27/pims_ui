/**
 * API Client Configuration
 * 
 * This file configures the RTK Query API client for managing requests to the backend.
 * It includes endpoints for login and logout, dynamically referencing pre-defined URLs.
 * 
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../client/baseurl"; // Import the base URL
import { loginUrl, logoutUrl } from "../services/client/apiEndpoints"; // Import authentication URLs

export const apiClient = createApi({
  reducerPath: "apiClient",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Use the dynamically imported base URL
    credentials: "include", // Include HttpOnly cookies
  }),
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: loginUrl, // Use the pre-defined login URL
        method: "POST",
        body: credentials,
      }),
    }),
    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: logoutUrl, // Use the pre-defined logout URL
        method: "POST",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useLogoutMutation } = apiClient;
