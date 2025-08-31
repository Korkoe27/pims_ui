import { apiClient } from "../api_client/apiClient";
import {
  gradingUrl,
  sectionGradingUrl,
  finalGradingUrl,
} from "../end_points/endpoints";

export const gradingApi = apiClient.injectEndpoints({
  tagTypes: ["Grading"],
  endpoints: (builder) => ({
    getGrading: builder.query({
      query: (appointmentId) => ({
        url: gradingUrl(appointmentId),
        method: "GET",
      }),
      providesTags: ["Grading"],
    }),

    createGrading: builder.mutation({
      query: ({ appointmentId, body }) => ({
        url: sectionGradingUrl(appointmentId, body.section_type),
        method: "POST",
        body: {
          appointment: appointmentId,
          section: body.section_type,
          score: body.marks,
          remarks: body.remarks,
        },
      }),
      invalidatesTags: ["Grading"],
    }),

    updateGrading: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: gradingUrl(appointmentId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Grading"],
    }),
  }),
});

export const {
  useGetGradingQuery,
  useCreateGradingMutation,
  useUpdateGradingMutation,
} = gradingApi;
