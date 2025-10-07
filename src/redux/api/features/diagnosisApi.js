import { apiClient } from "../api_client/apiClient";
import {
  createDiagnosisUrl,
  listAllDiagnosesUrl,
  fetchAppointmentDiagnosesUrl,
} from "../end_points/endpoints";
import { TAGS } from "../tags/tags";

export const diagnosisApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create new diagnosis for appointment
    createDiagnosis: builder.mutation({
      query: ({ appointmentId, data }) => {
        console.log(
          "🔍 API Call - createDiagnosis for appointmentId:",
          appointmentId,
          "with data:",
          data
        );
        return {
          url: createDiagnosisUrl(appointmentId), // uses the appointmentId in the URL
          method: "POST",
          body: data, // ✅ this should be the object with differential_diagnosis, etc.
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
      query: (appointmentId) => {
        console.log(
          "🔍 API Call - getAppointmentDiagnosis for appointmentId:",
          appointmentId
        );
        return {
          url: fetchAppointmentDiagnosesUrl(appointmentId),
          method: "GET",
        };
      },
      providesTags: [TAGS.APPOINTMENT_DIAGNOSIS],
    }),
  }),
});

export const {
  useCreateDiagnosisMutation,
  useGetAllDiagnosisQuery,
  useGetAppointmentDiagnosisQuery,
} = diagnosisApi;
