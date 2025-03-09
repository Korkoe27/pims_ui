import { apiClient } from "../api_client/apiClient";
import {
  createCaseHistoryUrl,
  updateCaseHistoryUrl,
  fetchCaseHistoryUrl,
  fetchSymptomsUrl, // ✅ New Symptoms URL
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    fetchCaseHistory: builder.query({
      query: (appointmentId) => fetchCaseHistoryUrl(appointmentId),
      providesTags: ["CaseHistory"],
    }),

    createCaseHistory: builder.mutation({
      query: (data) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    updateCaseHistory: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: updateCaseHistoryUrl(appointmentId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    /** ✅ Fetch Symptoms Dynamically **/
    fetchSymptoms: builder.query({
      query: () => fetchSymptomsUrl,
      providesTags: ["Symptoms"],
    }),
  }),
});

export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
  useFetchSymptomsQuery, // ✅ Export the new hook
} = consultationApi;
