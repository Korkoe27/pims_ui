import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./base_url/baseurl";
import { loginUrl, logoutUrl, checkSessionUrl } from "./endpoints/endpoints";

// Base configuration for all authentication-related endpoints
export const authApi = createApi({
  reducerPath: "authApi", // The name of this API slice
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Replace with your actual API base URL
    credentials: "include", // Ensures cookies (like HTTP-only tokens) are sent with requests
    prepareHeaders: (headers) => {
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

    // Check session query
    checkSession: builder.query({
      query: () => checkSessionUrl,
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useCheckSessionQuery } =
  authApi;
