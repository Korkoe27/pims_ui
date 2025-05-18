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

    /** ✅ Create Internal Observations **/
    createInternalObservation: builder.mutation({
      query: ({ appointmentId, observations }) => ({
        url: createInternalsUrl(appointmentId),
        method: "POST",
        body: { observations },
      }),
      invalidatesTags: ["InternalObservations"],
    }),
  }),
});

export const {
  useFetchInternalConditionsQuery,
  useFetchInternalObservationsQuery,
  useCreateInternalObservationMutation,
} = internalsApi;
