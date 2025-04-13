import { apiClient } from "../api_client/apiClient";
import {
  createDiagnosisUrl,
  listAllDiagnosesUrl,
  fetchAppointmentDiagnosesUrl,
} from "../end_points/endpoints";

export const diagnosisApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create new diagnosis for appointment
    createDiagnosis: builder.mutation({
      query: ({ appointmentId, data }) => ({
        url: createDiagnosisUrl(appointmentId), // uses the appointmentId in the URL
        method: "POST",
        body: data, // ✅ this should be the object with differential_diagnosis, etc.
      }),
    }),
    
    // List all diagnosis
    getAllDiagnosis: builder.query({
      query: () => ({
        url: listAllDiagnosesUrl,
        method: "GET",
      }),
    }),

    // Get all diagnoses linked to an appointment
    getAppointmentDiagnosis: builder.query({
      query: (appointmentId) => ({
        url: fetchAppointmentDiagnosesUrl(appointmentId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateDiagnosisMutation,
  useGetAllDiagnosisQuery,
  useGetAppointmentDiagnosisQuery,
} = diagnosisApi;
