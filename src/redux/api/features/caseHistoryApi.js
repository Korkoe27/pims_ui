import { apiClient } from "../api_client/apiClient";
import {
  createOrUpdateCaseHistoryUrl,
  fetchCaseHistoryUrl,
  fetchCaseHistoryByVersionUrl,
} from "../end_points/endpoints";

export const caseHistoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Case History by Consultation Version (version_awareness) */
    fetchCaseHistory: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        // ✅ BOTH appointmentId and versionId are required for version-aware queries
        if (versionId && appointmentId) {
          return fetchCaseHistoryByVersionUrl(appointmentId, versionId);
        }
        // Fallback to appointmentId only if versionId not available
        if (appointmentId) {
          return fetchCaseHistoryUrl(appointmentId);
        }
        // If no appointmentId, skip the query
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
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
