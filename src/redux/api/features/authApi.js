/**
 * authApi.js
 *
 * Authentication-related API endpoints, injected into the apiClient.
 */

import apiClient from "../api_client/apiClient";
import { loginUrl, logoutUrl, checkSessionUrl } from "../end_points/endpoints";

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
    // 🔹 Logout Endpoint
    // ---------------------------------------
    logout: builder.mutation({
      query: (refreshToken) => ({
        url: logoutUrl,
        method: "POST",
        body: { refresh: refreshToken },
      }),
      invalidatesTags: ["Auth"],
    }),

    // ---------------------------------------
    // 🔹 Check Session (alias for getUser)
    // ---------------------------------------
    getUser: builder.query({
      query: () => ({
        url: checkSessionUrl,  // ✅ same endpoint
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }),
      providesTags: ["User"],
      transformResponse: (response) => ({
        authenticated: response.authenticated,
        user: response.user,
        access: response.user?.access || {},
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
