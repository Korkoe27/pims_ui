import { apiClient } from "../api_client/apiClient";
import { startConsultationUrl, listConsultationVersionsUrl } from "../end_points/endpoints";

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
      // tag a specific appointment if you want cache invalidation later
      invalidatesTags: ["ConsultationVersions"],
    }),

    /** 🔹 List all versions for a given appointment */
    fetchConsultationVersions: builder.query({
      query: (appointmentId) => listConsultationVersionsUrl(appointmentId),
      providesTags: ["ConsultationVersions"],
    }),
  }),
});

export const {
  useStartConsultationMutation,
  useFetchConsultationVersionsQuery,
} = consultationsApi;
