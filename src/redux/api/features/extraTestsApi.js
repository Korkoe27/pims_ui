import { apiClient } from "../api_client/apiClient";
import {
  createExtraTestUrl,
  fetchExtraTestsUrl,
} from "../end_points/endpoints";

// Create ExtraTest API functions using `apiClient`
export const extraTestApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Extra Tests for an Appointment **/
    fetchExtraTests: builder.query({
      query: (appointmentId) => ({
        url: fetchExtraTestsUrl(appointmentId),
      }),
      providesTags: ["ExtraTests"],
    }),

    /** ✅ Create Extra Test for an Appointment **/
    createExtraTest: builder.mutation({
      query: (formData) => {
        const appointmentId = formData.get("appointment"); // ✅ Grab from FormData
        return {
          url: createExtraTestUrl(appointmentId),
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ExtraTests"],
    }),
  }),
});

export const { useFetchExtraTestsQuery, useCreateExtraTestMutation } =
  extraTestApi;
