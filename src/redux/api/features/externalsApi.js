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
      query: (appointment) => fetchExternalObservationsUrl(appointment),
      providesTags: ["ExternalObservations"],
    }),

    /** ✅ Create an External Observation **/
    createExternalObservation: builder.mutation({
      query: ({ appointment, observations }) => ({
        url: createExternalObservationUrl(appointment),
        method: "POST",
        body: {
          appointment, // ✅ crucial fix
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
