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
  fetchPatientAppointmentsUrl,
  fetchPatientOptionsUrl,
  fetchRegionsUrl,
  fetchOccupationCategoriesUrl,
} from "../end_points/endpoints";

export const patientApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all patients with pagination support
    getAllPatients: builder.query({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: listAllPatientsUrl,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
        },
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
      async onQueryStarted(patientData, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // console.log("✅ Patient Created Successfully:", data);
        } catch (error) {
          console.error("❌ Patient Creation Failed:", error);
        }
      },
    }),

    // Fetch Patient Appointments
    getPatientAppointments: builder.query({
      query: (patientId) => ({
        url: fetchPatientAppointmentsUrl(patientId), // Use the endpoint function
        method: "GET",
      }),
    }),

    // Fetch Patient Options (regions and occupation categories)
    getPatientOptions: builder.query({
      query: () => ({
        url: fetchPatientOptionsUrl,
        method: "GET",
      }),
    }),

    // Fetch Regions
    getRegions: builder.query({
      query: () => ({
        url: fetchRegionsUrl,
        method: "GET",
      }),
    }),

    // Fetch Occupation Categories
    getOccupationCategories: builder.query({
      query: () => ({
        url: fetchOccupationCategoriesUrl,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useGetPatientDetailsQuery,
  useSearchPatientsQuery,  // ✅ Normal query
  useLazySearchPatientsQuery, // ✅ RTK Query automatically provides this
  useUpdatePatientDetailsMutation,
  useCreatePatientMutation,
  useGetPatientAppointmentsQuery,
  useGetPatientOptionsQuery,
  useGetRegionsQuery,
  useGetOccupationCategoriesQuery,
} = patientApi;
