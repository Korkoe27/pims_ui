import { apiClient } from "../api_client/apiClient";
import {
  createCaseHistoryUrl,
  updateCaseHistoryUrl,
  fetchCaseHistoryUrl,
  fetchSymptomsUrl, // ✅ Symptoms URL
  fetchMedicalConditionsUrl, // ✅ New Medical Conditions URL
  fetchOcularConditionsUrl, // ✅ New Ocular Conditions URL
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    fetchCaseHistory: builder.query({
      query: (appointmentId) => fetchCaseHistoryUrl(appointmentId),
      providesTags: ["CaseHistory"],
    }),

    createCaseHistory: builder.mutation({
      query: (data) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    updateCaseHistory: builder.mutation({
      query: ({ appointmentId, ...data }) => ({
        url: updateCaseHistoryUrl(appointmentId),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CaseHistory"],
    }),

    /** ✅ Fetch Symptoms Dynamically **/
    fetchSymptoms: builder.query({
      query: () => fetchSymptomsUrl,
      providesTags: ["Symptoms"],
    }),

    /** ✅ Fetch Medical Conditions Dynamically **/
    fetchMedicalConditions: builder.query({
      query: () => fetchMedicalConditionsUrl,
      providesTags: ["MedicalConditions"],
    }),

    /** ✅ Fetch Ocular Conditions Dynamically **/
    fetchOcularConditions: builder.query({
      query: () => fetchOcularConditionsUrl,
      providesTags: ["OcularConditions"],
    }),
  }),
});

export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
  useFetchSymptomsQuery, // ✅ Export the new hook
  useFetchMedicalConditionsQuery, // ✅ Export Medical Conditions hook
  useFetchOcularConditionsQuery, // ✅ Export Ocular Conditions hook
} = consultationApi;
