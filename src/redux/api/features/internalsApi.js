import { apiClient } from "../api_client/apiClient";
import {
  internalUrl,
  fetchInternalObservationsUrl,
  fetchInternalObservationsByVersionUrl,
  createInternalsUrl,
} from "../end_points/endpoints";

export const internalsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all available Internal Conditions **/
    fetchInternalConditions: builder.query({
      query: () => internalUrl,
      providesTags: ["InternalConditions"],
    }),

    /** ✅ Fetch Observations for an Appointment (with optional version) **/
    fetchInternalObservations: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        // ✅ Both appointmentId and versionId for version-aware queries
        if (versionId && appointmentId) {
          return fetchInternalObservationsByVersionUrl(appointmentId, versionId);
        }
        // Fallback to appointmentId only
        if (appointmentId) {
          return fetchInternalObservationsUrl(appointmentId);
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: ["InternalObservations"],
    }),

    /** ✅ Create an Internal Observation **/
    createInternalObservation: builder.mutation({
      query: ({ appointmentId, observations, consultation_version }) => {
        const body = {
          appointment: appointmentId,
          observations,
          consultation_version,
        };
        console.log("🔹 internalsApi mutation body:", body);
        return {
          url: createInternalsUrl(appointmentId),
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["InternalObservations"],
    }),
  }),
});

export const {
  useFetchInternalConditionsQuery,
  useFetchInternalObservationsQuery,
  useCreateInternalObservationMutation,
} = internalsApi;
