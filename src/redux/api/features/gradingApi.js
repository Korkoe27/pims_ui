// gradingApi.js
import { apiClient } from "../api_client/apiClient";
import {
  gradingUrl,
  sectionGradingUrl,
  finalGradingUrl,
} from "../end_points/endpoints";

export const gradingApi = apiClient.injectEndpoints({
  tagTypes: ["Grading"],
  endpoints: (builder) => ({
    // Get all section gradings for an appointment
    getGrading: builder.query({
      query: (appointmentId) => ({
        url: gradingUrl(appointmentId),
        method: "GET",
      }),
      providesTags: ["Grading"],
    }),

    // Create a new section grading
    createGrading: builder.mutation({
      query: ({ appointmentId, body }) => ({
        url: sectionGradingUrl(appointmentId, body.section_type),
        method: "POST",
        body: {
          appointment: appointmentId,
          section: body.section_type,
          score: body.score,     // ✅ now consistent
          remarks: body.remarks,
        },
      }),
      invalidatesTags: ["Grading"],
    }),

    // Update an existing section grading
    updateSectionGrading: builder.mutation({
      query: ({ appointmentId, section, score, remarks }) => ({
        url: sectionGradingUrl(appointmentId, section),
        method: "PATCH",
        body: {
          score,                // ✅ backend field name
          remarks,
        },
      }),
      invalidatesTags: ["Grading"],
    }),

    // Update the final grading for an appointment
    updateFinalGrading: builder.mutation({
      query: ({ appointmentId, score, remarks }) => ({
        url: finalGradingUrl(appointmentId),
        method: "PATCH",
        body: {
          score,                // ✅ backend field name
          remarks,
        },
      }),
      invalidatesTags: ["Grading"],
    }),
  }),
});

export const {
  useGetGradingQuery,
  useCreateGradingMutation,
  useUpdateSectionGradingMutation,
  useUpdateFinalGradingMutation,
} = gradingApi;
