// src/redux/api/features/consultationsApi.js

import { apiClient } from "../api_client/apiClient";
import {
  startConsultationUrl,
  listConsultationVersionsUrl,
} from "../end_points/endpoints";

export const consultationsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** 🔹 Start (or fetch active) consultation version */
    startConsultation: builder.mutation({
      query: ({ appointmentId, versionType = "student" }) => {
        // startConsultationUrl is a string, not a function
        const url = startConsultationUrl;
        console.log("🚀 startConsultation URL:", url);
        console.log("📦 Request body:", { appointment_id: appointmentId, version_type: versionType });

        return {
          url,
          method: "POST",
          body: { appointment_id: appointmentId, version_type: versionType },
        };
      },
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
  }),
});

export const {
  useStartConsultationMutation,
  useFetchConsultationVersionsQuery,
} = consultationsApi;
