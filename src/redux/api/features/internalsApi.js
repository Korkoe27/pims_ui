import { apiClient } from "../api_client/apiClient";
import {
  internalUrl,
  fetchInternalsUrl,
  createInternalsUrl,
} from "../end_points/endpoints";

export const internalsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all available Internal Conditions **/
    fetchInternalConditions: builder.query({
      query: () => internalUrl,
      providesTags: ["InternalConditions"],
    }),

    /** ✅ Fetch Observations for an Appointment **/
    fetchInternalObservations: builder.query({
      query: (appointmentId) => fetchInternalsUrl(appointmentId),
      providesTags: ["InternalObservations"],
    }),

    createInternalObservation: builder.mutation({
      query: ({ appointment, observations }) => ({
        url: createInternalsUrl(appointment),
        method: "POST",
        body: { appointment, observations }, // ✅ use `appointment`, not `appointmentId`
      }),
    }),
  }),
});

export const {
  useFetchInternalConditionsQuery,
  useFetchInternalObservationsQuery,
  useCreateInternalObservationMutation,
} = internalsApi;
