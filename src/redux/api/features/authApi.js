/**
 * authApi.js
 *
 * Authentication-related API endpoints, injected into the apiClient.
 * Handles login, logout (with session cleanup), and user session check.
 */

import apiClient from "../api_client/apiClient";
import { loginUrl, logoutUrl, checkSessionUrl } from "../end_points/endpoints";
import { clearSessionData } from "../../../utils/sessionUtils";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // 🔹 Login Endpoint
    // ---------------------------------------
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

    // ---------------------------------------
    // 🔹 Logout Endpoint (with full cleanup)
    // ---------------------------------------
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: logoutUrl,
        method: "POST",
        body: { refresh: refreshToken },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // Ignore network or backend logout failures
        } finally {
          // 🧹 Always clear client session
          clearSessionData({ dispatch });
          window.location.href = "/login";
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // ---------------------------------------
    // 🔹 Check Session / Get Current User
    // ---------------------------------------
    getUser: builder.query({
      query: () => ({
        url: checkSessionUrl, // ✅ same endpoint
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
      providesTags: ["User"],
      transformResponse: (response) => ({
        authenticated: response.authenticated,
        user: response.user, // User object now includes roles and role_codes
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
} = authApi;
