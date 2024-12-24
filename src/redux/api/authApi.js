import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base configuration for all authentication-related endpoints
export const authApi = createApi({
  reducerPath: "authApi", // The name of this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Replace with your actual API base URL
    credentials: "include", // Ensures cookies (like HTTP-only tokens) are sent with requests
  }),
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login", // Your login endpoint
        method: "POST",
        body: credentials, // Send username/password in the request body
      }),
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout", // Your logout endpoint
        method: "POST",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
} = authApi;
