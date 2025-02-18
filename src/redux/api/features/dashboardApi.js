/**
 * Dashboard API
 *
 * Manages API interactions for the dashboard.
 */

import { apiClient } from "../api_client/apiClient";
import { getDashboardDataUrl } from "../end_points/endpoints";

export const dashboardApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => getDashboardDataUrl,
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled; // Await the query to fulfill
        } catch (error) {
          console.error("Error fetching dashboard data:", error); // Log any errors
        }
      },
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
