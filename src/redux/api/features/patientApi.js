/**
 * patientApi.js
 *
 * Handles all patient-related API interactions.
 */

import { apiClient } from "../api_client/apiClient";
import {
  fetchSinglePatientDetailsUrl,
  searchPatientsUrl,
  updatePatientDetailsUrl,
  listAllPatientsUrl,
  createNewPatientUrl,
} from "../end_points/endpoints";

export const patientApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all patients
    getAllPatients: builder.query({
      query: () => ({
        url: listAllPatientsUrl,
        method: "GET",
      }),
    }),

    // Fetch single patient details
    getPatientDetails: builder.query({
      query: (patientId) => ({
        url: fetchSinglePatientDetailsUrl(patientId),
        method: "GET",
      }),
    }),

    // Search patients
    searchPatients: builder.query({
      query: (searchQuery) => ({
        url: searchPatientsUrl(searchQuery),
        method: "GET",
      }),
    }),

    // Update patient details
    updatePatientDetails: builder.mutation({
      query: ({ patientId, ...patientData }) => ({
        url: updatePatientDetailsUrl(patientId),
        method: "PUT",
        body: patientData,
      }),
    }),

    // Create a new patient
    createPatient: builder.mutation({
      query: (patientData) => ({
        url: createNewPatientUrl,
        method: "POST",
        body: patientData,
      }),
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetPatientDetailsQuery,
  useSearchPatientsQuery,
  useUpdatePatientDetailsMutation,
  useCreatePatientMutation,
} = patientApi;
