import { apiClient } from "../api_client/apiClient";
import {
  createExtraTestUrl,
  fetchExtraTestsUrl,
} from "../end_points/endpoints";

export const extraTestApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all Extra Tests for a specific appointment **/
    fetchExtraTests: builder.query({
      query: (appointmentId) => ({
        url: fetchExtraTestsUrl(appointmentId),
      }),
      providesTags: ["ExtraTests"],
    }),

    /** ✅ Create new Extra Test with FormData upload **/
    createExtraTest: builder.mutation({
      query: (formData) => {
        const appointmentId = formData.get("appointment");
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
