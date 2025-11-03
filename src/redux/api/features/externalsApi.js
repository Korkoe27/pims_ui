import { apiClient } from "../api_client/apiClient";
import {
  externalUrl,
  createExternalObservationUrl,
  fetchExternalObservationsUrl,
  fetchExternalObservationsByVersionUrl,
} from "../end_points/endpoints";

export const externalsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all available External Conditions **/
    fetchExternalConditions: builder.query({
      query: () => externalUrl,
      providesTags: ["ExternalConditions"],
    }),

    /** ✅ Fetch Observations for an Appointment (with optional version) **/
    fetchExternalObservations: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        // ✅ Both appointmentId and versionId for version-aware queries
        if (versionId && appointmentId) {
          return fetchExternalObservationsByVersionUrl(appointmentId, versionId);
        }
        // Fallback to appointmentId only
        if (appointmentId) {
          return fetchExternalObservationsUrl(appointmentId);
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: ["ExternalObservations"],
    }),

    /** ✅ Create an External Observation **/
    createExternalObservation: builder.mutation({
      query: ({ appointmentId, observations }) => ({
        url: createExternalObservationUrl(appointmentId),
        method: "POST",
        body: {
          appointment: appointmentId,
          observations,
        },
      }),
      invalidatesTags: ["ExternalObservations"],
    }),
  }),
});

export const {
  useFetchExternalConditionsQuery,
  useFetchExternalObservationsQuery,
  useCreateExternalObservationMutation,
} = externalsApi;
