import { apiClient } from "../api_client/apiClient";
import {
  externalUrl,
  createExternalObservationUrl,
  fetchExternalObservationsUrl,
} from "../end_points/endpoints";

export const externalsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all available External Conditions **/
    fetchExternalConditions: builder.query({
      query: () => externalUrl,
      providesTags: ["ExternalConditions"],
    }),

    /** ✅ Fetch Observations for an Appointment **/
    fetchExternalObservations: builder.query({
      query: (appointmentId) => fetchExternalObservationsUrl(appointmentId),
      providesTags: ["ExternalObservations"],
    }),

    /** ✅ Create an External Observation **/
    createExternalObservation: builder.mutation({
      query: ({ appointmentId, observations }) => ({
        url: createExternalObservationUrl(appointmentId),
        method: "POST",
        body: { observations }, // wrap observations list in an object
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
