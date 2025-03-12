import { apiClient } from "../api_client/apiClient";
import {
  createCaseHistoryUrl,
  fetchCaseHistoryUrl,
  fetchSymptomsUrl,
  fetchMedicalConditionsUrl,
  fetchOcularConditionsUrl,
  fetchPatientHistoryUrl, // ✅ New: Fetch Patient History
  createPatientHistoryUrl, // ✅ New: Create Patient History
  updatePatientHistoryUrl, // ✅ New: Update Patient History
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Latest Case History for an Appointment **/
    fetchCaseHistory: builder.query({
      query: (appointmentId) => fetchCaseHistoryUrl(appointmentId),
      providesTags: ["CaseHistory"],
    }),

    /** ✅ Create a New Version of Case History **/
    createCaseHistory: builder.mutation({
      query: (data) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    /** ✅ Fetch Symptoms **/
    fetchSymptoms: builder.query({
      query: () => fetchSymptomsUrl,
      providesTags: ["Symptoms"],
    }),

    /** ✅ Fetch Medical Conditions **/
    fetchMedicalConditions: builder.query({
      query: () => fetchMedicalConditionsUrl,
      providesTags: ["MedicalConditions"],
    }),

    /** ✅ Fetch Ocular Conditions **/
    fetchOcularConditions: builder.query({
      query: () => fetchOcularConditionsUrl,
      providesTags: ["OcularConditions"],
    }),

    /** ✅ Fetch Patient History **/
    fetchPatientHistory: builder.query({
      query: (patientId) => fetchPatientHistoryUrl(patientId),
      providesTags: ["PatientHistory"],
    }),

    /** ✅ Create Patient History (if none exists) **/
    createPatientHistory: builder.mutation({
      query: (data) => ({
        url: createPatientHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PatientHistory"],
    }),

    /** ✅ Update Patient History **/
    updatePatientHistory: builder.mutation({
      query: ({ historyId, ...data }) => ({
        url: updatePatientHistoryUrl(historyId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PatientHistory"],
    }),
  }),
});

export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useFetchSymptomsQuery,
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
  useFetchPatientHistoryQuery, // ✅ Export Patient History Fetch
  useCreatePatientHistoryMutation, // ✅ Export Patient History Create
  useUpdatePatientHistoryMutation, // ✅ Export Patient History Update
} = consultationApi;
