import { apiClient } from "../api_client/apiClient";
import {
  createRefractionUrl,
  fetchRefractionUrl,
} from "../end_points/endpoints";

export const refractionApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Refraction for an Appointment **/
    fetchRefraction: builder.query({
      query: (appointmentId) => ({
        url: fetchRefractionUrl(appointmentId),
      }),
      providesTags: ["Refraction"],
    }),

    /** ✅ Create Refraction for an Appointment **/
    createRefraction: builder.mutation({
      query: ({ appointmentId, ...body }) => ({
        url: createRefractionUrl(appointmentId),
        method: "POST",
        body,
      }),
      invalidatesTags: ["Refraction"],
    }),
  }),
});

export const {
  useFetchRefractionQuery,
  useCreateRefractionMutation,
} = refractionApi;
