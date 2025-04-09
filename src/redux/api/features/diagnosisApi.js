import { apiClient } from "../api_client/apiClient";
import {
  createDiagnosisUrl,
  listDiagnosisUrl,
  getAppointmentDiagnosisUrl,
} from "../end_points/endpoints";

export const diagnosisApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create new diagnosis for appointment
    createDiagnosis: builder.mutation({
      query: ({ appointmentId, data }) => ({
        url: createDiagnosisUrl(appointmentId),
        method: "POST",
        body: data,
      }),
    }),

    // List all diagnosis
    getAllDiagnosis: builder.query({
      query: () => ({
        url: listDiagnosisUrl,
        method: "GET",
      }),
    }),

    // Get all diagnoses linked to an appointment
    getAppointmentDiagnosis: builder.query({
      query: (appointmentId) => ({
        url: getAppointmentDiagnosisUrl(appointmentId),
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
