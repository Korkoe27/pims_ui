import { apiClient } from "../api_client/apiClient";
import {
  fetchMedicalConditionsUrl,
  fetchOcularConditionsUrl,
} from "../end_points/endpoints";

export const conditionsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useFetchMedicalConditionsQuery,
  useFetchOcularConditionsQuery,
} = conditionsApi;
