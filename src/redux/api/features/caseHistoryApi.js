import { apiClient } from "../api_client/apiClient";
import {
  createCaseHistoryUrl,
  fetchCaseHistoryUrl,
} from "../end_points/endpoints";

export const caseHistoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Latest Case History for an Appointment **/
    fetchCaseHistory: builder.query({
      query: (appointmentId) => fetchCaseHistoryUrl(appointmentId),
      providesTags: ["CaseHistory"],
    }),

    /** ✅ Create a New Version of Case History **/
    createCaseHistory: builder.mutation({
      query: (data) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    
  }),
});

export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
} = caseHistoryApi;
