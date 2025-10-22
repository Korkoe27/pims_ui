import { apiClient } from "../api_client/apiClient";
import {
  patientsReportUrl,
  appointmentsReportUrl,
  gradingsReportUrl,
  diagnosisReportUrl,
  inventoryReportUrl,
} from "../end_points/endpoints";

export const reportsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getPatientReports: builder.query({
      query: (params) => ({
        url: patientsReportUrl,
        params, // e.g., { start_date, end_date, clinic, aggregate }
      }),
    }),

    getAppointmentReports: builder.query({
      query: (params) => ({
        url: appointmentsReportUrl,
        params,
      }),
    }),

    getGradingReports: builder.query({
      query: (params) => ({
        url: gradingsReportUrl,
        params,
      }),
    }),

    getDiagnosisReports: builder.query({
      query: (params) => ({
        url: diagnosisReportUrl,
        params,
      }),
    }),

    getInventoryReports: builder.query({
      query: (params) => ({
        url: inventoryReportUrl,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPatientReportsQuery,
  useGetAppointmentReportsQuery,
  useGetGradingReportsQuery,
  useGetDiagnosisReportsQuery,
  useGetInventoryReportsQuery,
} = reportsApi;
