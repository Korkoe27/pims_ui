import { apiClient } from "../api_client/apiClient";
import {
  createVisualAcuityUrl,
  fetchVisualAcuityUrl,
  fetchVisualAcuityByVersionUrl,
} from "../end_points/endpoints";

export const visualAcuityApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Visual Acuity for an Appointment (with optional version) */
    fetchVisualAcuity: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        // ✅ Both appointmentId and versionId for version-aware queries
        if (versionId && appointmentId) {
          return fetchVisualAcuityByVersionUrl(appointmentId, versionId);
        }
        // Fallback to appointmentId only
        if (appointmentId) {
          return fetchVisualAcuityUrl(appointmentId);
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: ["VisualAcuity"],
    }),

    /** ✅ Create a New Visual Acuity Record */
    createVisualAcuity: builder.mutation({
      query: (data) => ({
        url: createVisualAcuityUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VisualAcuity"],
    }),

   
  }),
});

export const {
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
} = visualAcuityApi;
