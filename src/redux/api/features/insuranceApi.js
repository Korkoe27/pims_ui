/**
 * insuranceApi.js
 *
 * Handles all insurance-related API interactions.
 */

import { apiClient } from "../api_client/apiClient";
import { fetchPatientInsurancesUrl, createInsuranceUrl } from "../end_points/endpoints";

export const insuranceApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all active insurances for a patient
    getPatientInsurances: builder.query({
      query: ({ patientId, activeOnly = true }) => ({
        url: fetchPatientInsurancesUrl(patientId),
        method: "GET",
        params: {
          active_only: activeOnly,
        },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: "Insurance", id: patientId },
      ],
    }),

    // Create a new insurance for a patient
    createInsurance: builder.mutation({
      query: ({ patientId, insuranceData }) => ({
        url: createInsuranceUrl(patientId),
        method: "POST",
        body: insuranceData,
      }),
      invalidatesTags: (result, error, { patientId }) => [
        { type: "Insurance", id: patientId },
      ],
    }),
  }),
});

export const {
  useGetPatientInsurancesQuery,
  useLazyGetPatientInsurancesQuery,
  useCreateInsuranceMutation,
} = insuranceApi;
