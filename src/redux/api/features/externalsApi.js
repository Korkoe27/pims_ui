import { apiClient } from "../api_client/apiClient";
import {
  fetchExternalConditionsUrl,
  createExternalObservationUrl,
  fetchExternalObservationsUrl,
} from "../end_points/endpoints";

export const externalsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all available External Conditions **/
    fetchExternalConditions: builder.query({
      query: () => fetchExternalConditionsUrl,
      providesTags: ["ExternalConditions"],
    }),

    /** ✅ Fetch Observations for an Appointment **/
    fetchExternalObservations: builder.query({
      query: (appointmentId) => fetchExternalObservationsUrl(appointmentId),
      providesTags: ["ExternalObservations"],
    }),

    /** ✅ Create an External Observation **/
    createExternalObservation: builder.mutation({
      query: (data) => ({
        url: createExternalObservationUrl,
        method: "POST",
        body: data,
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
