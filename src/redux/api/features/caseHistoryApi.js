import { apiClient } from "../api_client/apiClient";
import {
  createOrUpdateCaseHistoryUrl,   // <- use this
  fetchCaseHistoryUrl,
} from "../end_points/endpoints";

export const caseHistoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch latest Case History for an appointment */
    fetchCaseHistory: builder.query({
      query: (appointmentId) => fetchCaseHistoryUrl(appointmentId),
      providesTags: ["CaseHistory"],
    }),

    /** ✅ Create/Update Case History by appointment (POST upsert) */
    createCaseHistory: builder.mutation({
      query: (data) => ({
        url: createOrUpdateCaseHistoryUrl,   // <- renamed
        method: "POST",
        body: data,                          // must include { appointment: "<uuid>", ... }
      }),
      invalidatesTags: ["CaseHistory"],
    }),
  }),
});

export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
} = caseHistoryApi;
