import { apiClient } from "../api_client/apiClient";
import {
  startConsultationUrl,
  listConsultationVersionsUrl,
  finalizeConsultationVersionUrl,
} from "../end_points/endpoints";

export const consultationsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** 🔹 Start (or fetch active) consultation version */
    startConsultation: builder.mutation({
      query: ({ appointmentId, versionType = "student" }) => ({
        url: startConsultationUrl,
        method: "POST",
        body: {
          appointment_id: appointmentId,
          version_type: versionType,
        },
      }),
      invalidatesTags: ["ConsultationVersions"],
    }),

    /** 🔹 List all versions for a given appointment */
    fetchConsultationVersions: builder.query({
      query: (appointmentId) => ({
        url: listConsultationVersionsUrl(appointmentId),
        method: "GET",
      }),
      providesTags: ["ConsultationVersions"],
    }),

    /** 🔹 Finalize a specific consultation version */
    finalizeConsultation: builder.mutation({
      query: (versionId) => ({
        url: finalizeConsultationVersionUrl(versionId),
        method: "POST",
      }),
      invalidatesTags: ["ConsultationVersions"],
    }),
  }),
});

export const {
  useStartConsultationMutation,
  useFetchConsultationVersionsQuery,
  useFinalizeConsultationMutation,
} = consultationsApi;
