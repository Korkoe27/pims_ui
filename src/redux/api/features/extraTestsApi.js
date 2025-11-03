import { apiClient } from "../api_client/apiClient";
import {
  createExtraTestUrl,
  fetchExtraTestsUrl,
  fetchExtraTestsByVersionUrl,
} from "../end_points/endpoints";

export const extraTestApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch all Extra Tests for a specific appointment **/
    fetchExtraTests: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        if (versionId && appointmentId) {
          return { url: fetchExtraTestsByVersionUrl(appointmentId, versionId) };
        }
        if (appointmentId) {
          return { url: fetchExtraTestsUrl(appointmentId) };
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: ["ExtraTests"],
    }),

    /** ✅ Create new Extra Test with FormData upload **/
    createExtraTest: builder.mutation({
      query: ({ appointmentId, versionId, formData }) => {
        formData.append("consultation_version", versionId);
        return {
          url: createExtraTestUrl(appointmentId),
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["ExtraTests"],
    }),

    /** ✅ Delete Extra Test **/
    deleteExtraTest: builder.mutation({
      query: ({ appointmentId, testId }) => ({
        url: `${createExtraTestUrl(appointmentId)}${testId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExtraTests"],
    }),
  }),
});

export const { 
  useFetchExtraTestsQuery, 
  useCreateExtraTestMutation,
  useDeleteExtraTestMutation,
} = extraTestApi;
