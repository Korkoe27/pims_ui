/**
 * apiClient.js
 *
 * Base configuration for API interactions using RTK Query.
 * Handles base URL, credentials, headers, and token refresh.
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL, apiBaseURL } from "../base_url/baseurl";
import { TAGS } from "../tags/tags";
import { clearSessionData } from "../../../utils/sessionUtils";

export const apiClient = createApi({
  reducerPath: "apiClient",
  baseQuery: async (args, api, extraOptions) => {
    // --- Debug logging for consultation endpoints ---
    const debugLogIfConsultation = (request) => {
      try {
        const url = typeof request === "string" ? request : request.url;
        if (typeof url === "string" && url.startsWith("/consultations")) {
          const body = request.body;
          const safeBody =
            body && typeof body === "object" && !(body instanceof FormData)
              ? JSON.stringify(body)
              : String(body || "");
          console.debug("[API DEBUG] Consultation request ->", {
            method: request.method || "GET",
            url,
            body: safeBody,
          });
        }
      } catch {
        /* ignore debug errors */
      }
    };

    debugLogIfConsultation(args);

    // --- Primary request handler ---
    let result = await fetchBaseQuery({
      baseUrl: apiBaseURL,
      credentials: "include",
      prepareHeaders: (headers) => {
        // CSRF token
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrftoken="))
          ?.split("=")[1];
        if (csrfToken) headers.set("X-CSRFToken", csrfToken);

        // Authorization header
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

        // ✅ Fix for FormData uploads
        const contentType = headers.get("Content-Type");
        if (contentType === "application/json") {
          headers.delete("Content-Type");
        }

        return headers;
      },
    })(args, api, extraOptions);

    /* ------------------------------------------------------------------
       🔹 Handle 401 Unauthorized → Try refresh or reset session
    ------------------------------------------------------------------- */
    if (result?.error?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const refreshResult = await fetchBaseQuery({
          baseUrl: baseURL,
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
          // ✅ Save new token and retry request
          localStorage.setItem("access_token", refreshResult.data.access);
          result = await fetchBaseQuery({ baseUrl: apiBaseURL })(
            args,
            api,
            extraOptions
          );
        } else {
          // ❌ Refresh failed → clear session and redirect
          clearSessionData(api);
          window.location.href = "/login";
        }
      } else {
        // ❌ No refresh token → clear session and redirect
        clearSessionData(api);
        window.location.href = "/login";
      }
    }

    return result;
  },
  tagTypes: Object.values(TAGS),
  endpoints: () => ({}),
});

export default apiClient;
