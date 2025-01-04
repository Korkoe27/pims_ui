import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../client/baseurl"; // Import the base URL
import { loginUrl, logoutUrl } from "../client/endpoints"; // Import authentication URLs

// API client configured with login and logout endpoints
export const apiClient = createApi({
  reducerPath: "apiClient",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Use the dynamically imported base URL
    credentials: "include", // Include HttpOnly cookies
  }),
  endpoints: (builder) => ({
    // Login mutation
    login: builder.mutation({
      query: (credentials) => ({
        url: loginUrl, // Use the pre-defined login URL
        method: "POST",
        body: credentials, // Send credentials as body
      }),
    }),
    // Logout mutation
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
