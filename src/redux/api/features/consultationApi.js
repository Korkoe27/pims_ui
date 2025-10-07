import { apiClient } from "../api_client/apiClient";
import {
  startConsultationUrl,
  getConsultationUrl,
  transitionConsultationUrl,
  submitConsultationUrl,
  completeConsultationUrl,
  overrideConsultationUrl,
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Start or fetch active consultation
    startConsultation: builder.mutation({
      query: (appointmentId) => ({
        url: startConsultationUrl,
        method: "POST",
        body: { appointment: appointmentId },
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Get consultation details
    getConsultation: builder.query({
      query: (consultationId) => getConsultationUrl(consultationId),
      providesTags: ["Consultation"],
    }),

    // Transition consultation status
    transitionConsultation: builder.mutation({
      query: ({ consultationId, targetStatus }) => ({
        url: transitionConsultationUrl(consultationId),
        method: "POST",
        body: { status: targetStatus },
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Submit consultation for review
    submitConsultation: builder.mutation({
      query: (consultationId) => ({
        url: submitConsultationUrl(consultationId),
        method: "POST",
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Complete consultation
    completeConsultation: builder.mutation({
      query: (consultationId) => ({
        url: completeConsultationUrl(consultationId),
        method: "POST",
      }),
      invalidatesTags: ["Consultation"],
    }),

    // Admin override
    overrideConsultation: builder.mutation({
      query: ({ consultationId, targetStatus, reason }) => ({
        url: overrideConsultationUrl(consultationId),
        method: "POST",
        body: { status: targetStatus, reason },
      }),
      invalidatesTags: ["Consultation"],
    }),
  }),
});

export const {
  useStartConsultationMutation,
  useGetConsultationQuery,
  useTransitionConsultationMutation,
  useSubmitConsultationMutation,
  useCompleteConsultationMutation,
  useOverrideConsultationMutation,
} = consultationApi;
