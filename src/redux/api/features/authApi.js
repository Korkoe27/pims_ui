/**
 * authApi.js
 *
 * Authentication-related API endpoints, injected into the apiClient.
 */

import apiClient from "../api_client/apiClient";
import { loginUrl, logoutUrl, checkSessionUrl, getUserUrl } from "../end_points/endpoints";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: loginUrl,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => ({
        accessToken: response.access,
        refreshToken: response.refresh,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: logoutUrl,
        method: "POST",
      }),
      invalidatesTags: ["Auth"], // Invalidate cached session data
    }),

    // Check session query
    checkSession: builder.query({
      query: () => checkSessionUrl,
      providesTags: ["Auth"], // Cache session data
    }),

    // Fetch user data
    getUser: builder.query({
      query: () => ({
        url: getUserUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Include access token
        },
      }),
      providesTags: ["User"], // Cache user data
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCheckSessionQuery,
  useGetUserQuery,
  useLazyGetUserQuery
} = authApi;
