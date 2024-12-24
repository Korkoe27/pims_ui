import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./base_url/baseurl";
import { loginUrl, logoutUrl } from "./endpoints/endpoints";

// Base configuration for all authentication-related endpoints
export const authApi = createApi({
  reducerPath: "authApi", // The name of this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Replace with your actual API base URL
    credentials: "include", // Ensures cookies (like HTTP-only tokens) are sent with requests
  }),
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: loginUrl,
        method: "POST",
        body: credentials, 
      }),
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: logoutUrl, 
        method: "POST",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
} = authApi;
