import { apiClient } from "../api_client/apiClient";
import { getDashboardDataUrl } from "../end_points/endpoints";

export const dashboardApi = apiClient.injectEndpoints({
  // ✅ Register the tag used for cache invalidation
  overrideExisting: false,
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => getDashboardDataUrl,
      providesTags: ["Dashboard"], // ✅ Tag for auto-refetch via WebSocket
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      },
    }),
  }),
  // ✅ Attach the tag type
  tagTypes: ["Dashboard"],
});

export const { useGetDashboardDataQuery } = dashboardApi;
