import { apiClient } from "../api_client/apiClient";
import {
  fetchPatientHistoryUrl,
  createPatientHistoryUrl,
} from "../end_points/endpoints";

export const patientHistoryApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch the Latest Patient History for a Patient **/
    fetchPatientHistory: builder.query({
      query: (patientId) => fetchPatientHistoryUrl(patientId),
      providesTags: ["PatientHistory"],
    }),

    /** ✅ Create a New Version of Patient History **/
    createPatientHistory: builder.mutation({
      query: (data) => ({
        url: createPatientHistoryUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PatientHistory"],
    }),
  }),
});

export const {
  useFetchPatientHistoryQuery,
  useCreatePatientHistoryMutation,
} = patientHistoryApi;
