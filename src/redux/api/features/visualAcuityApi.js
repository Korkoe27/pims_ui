import { apiClient } from "../api_client/apiClient";
import {
  createVisualAcuityUrl,
  fetchVisualAcuityUrl,
  updateVisualAcuityUrl,
} from "../end_points/endpoints";

export const visualAcuityApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Visual Acuity for an Appointment */
    fetchVisualAcuity: builder.query({
      query: (appointmentId) => fetchVisualAcuityUrl(appointmentId),
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

    /** ✅ Update an Existing Visual Acuity Record */
    updateVisualAcuity: builder.mutation({
      query: ({ appointmentId, data }) => ({
        url: updateVisualAcuityUrl(appointmentId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["VisualAcuity"],
    }),
  }),
});

export const {
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
  useUpdateVisualAcuityMutation,
} = visualAcuityApi;
