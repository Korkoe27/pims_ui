// src/redux/api/features/dashboardApi.js

import { apiClient } from "../api_client/apiClient";
import { getDashboardDataUrl } from "../end_points/endpoints";
import { TAGS } from "../tags/tags"; // Centralized tags

export const dashboardApi = apiClient.injectEndpoints({
  // ✅ Declare tag types this slice uses
  tagTypes: [TAGS.DASHBOARD],

  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => getDashboardDataUrl,
      providesTags: [TAGS.DASHBOARD], // ✅ Used for cache invalidation
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      },
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
