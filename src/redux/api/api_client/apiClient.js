/**
 * apiClient.js
 *
 * Base configuration for API interactions using RTK Query.
 * This handles the base URL, credentials, and headers for all API calls.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../base_url/baseurl";
import { TAGS } from "../tags/tags";

export const apiClient = createApi({
  reducerPath: "apiClient",
  baseQuery: async (args, api, extraOptions) => {
    // Debug: log consultation-related outgoing requests (method, url, body)
    const debugLogIfConsultation = (request) => {
      try {
        const url = typeof request === "string" ? request : request.url;
        if (typeof url === "string" && url.startsWith("/consultations")) {
          // Avoid printing auth tokens/headers — only log method/url/body
          // If body is a FormData, we avoid reading it to prevent consumption.
          const body = request.body;
          const safeBody =
            body && typeof body === "object" && !(body instanceof FormData)
              ? JSON.stringify(body)
              : String(body || "");
          // eslint-disable-next-line no-console
          console.debug("[API DEBUG] Consultation request ->", {
            method: request.method || "GET",
            url,
            body: safeBody,
          });
        }
      } catch (e) {
        // swallow debug errors
      }
    };

    debugLogIfConsultation(args);

    let result = await fetchBaseQuery({
      baseUrl: baseURL, // Use the imported baseURL here
      credentials: "include",
      prepareHeaders: (headers) => {
        // Add CSRF token from cookies
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
        if (csrfToken) {
          headers.set("X-CSRFToken", csrfToken);
        }

        // Add Authorization header
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
      },
    })(args, api, extraOptions);

    // Handle token refresh if necessary
    if (result?.error?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const refreshResult = await fetchBaseQuery({
          baseUrl: baseURL, // Use the same baseURL for refreshing tokens
        })(
          {
            url: "auth/jwt/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data) {
          localStorage.setItem("access_token", refreshResult.data.access);
          result = await fetchBaseQuery({
            baseUrl: baseURL, // Retry with the new access token
          })(args, api, extraOptions);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return result;
  },
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});

export default apiClient;
