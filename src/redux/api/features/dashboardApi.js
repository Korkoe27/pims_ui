// src/redux/api/features/dashboardApi.js

import { apiClient } from "../api_client/apiClient";
import { getDashboardDataUrl } from "../end_points/endpoints";
import { TAGS } from "../tags/tags"; // Centralized tags

export const dashboardApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => getDashboardDataUrl,
      providesTags: [TAGS.DASHBOARD],
    }),
  }),
});


export const { useGetDashboardDataQuery } = dashboardApi;
