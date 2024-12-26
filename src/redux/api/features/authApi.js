/**
 * authApi.js
 *
 * Authentication-related API endpoints, injected into the apiClient.
 */

import { apiClient } from "../api_client/apiClient";
import { loginUrl, logoutUrl, checkSessionUrl } from "../end_points/endpoints";

export const authApi = apiClient.injectEndpoints({
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
