import { apiClient } from "../api_client/apiClient";
import {
  createDiagnosisUrl,
  updateDiagnosisUrl,
  listAllDiagnosesUrl,
  fetchAppointmentDiagnosesUrl,
  fetchAppointmentDiagnosesByVersionUrl,
} from "../end_points/endpoints";
import { TAGS } from "../tags/tags";

export const diagnosisApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create new diagnosis for appointment
    createDiagnosis: builder.mutation({
      query: ({ appointmentId, versionId, data }) => {
        const payload = {
          ...data,
          consultation_version: versionId,
        };
        console.log(
          "🔍 API Call - createDiagnosis for appointmentId:",
          appointmentId,
          "with data:",
          payload
        );
        return {
          url: createDiagnosisUrl(appointmentId),
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [TAGS.APPOINTMENT_DIAGNOSIS],
    }),

    // Update existing diagnosis for appointment
    updateDiagnosis: builder.mutation({
      query: ({ appointmentId, versionId, data }) => {
        const payload = {
          ...data,
          consultation_version: versionId,
        };
        console.log(
          "🔍 API Call - updateDiagnosis for appointmentId:",
          appointmentId,
          "with data:",
          payload
        );
        return {
          url: updateDiagnosisUrl(appointmentId),
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: [TAGS.APPOINTMENT_DIAGNOSIS],
    }),

    // List all diagnosis
    getAllDiagnosis: builder.query({
      query: () => {
        console.log("🔍 API Call - getAllDiagnosis");
        return {
          url: listAllDiagnosesUrl,
          method: "GET",
        };
      },
    }),

    // Get all diagnoses linked to an appointment
    getAppointmentDiagnosis: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        if (versionId && appointmentId) {
          return {
            url: fetchAppointmentDiagnosesByVersionUrl(appointmentId, versionId),
            method: "GET",
          };
        }
        if (appointmentId) {
          return {
            url: fetchAppointmentDiagnosesUrl(appointmentId),
            method: "GET",
          };
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: [TAGS.APPOINTMENT_DIAGNOSIS],
    }),
  }),
});

export const {
  useCreateDiagnosisMutation,
  useUpdateDiagnosisMutation,
  useGetAllDiagnosisQuery,
  useGetAppointmentDiagnosisQuery,
} = diagnosisApi;
