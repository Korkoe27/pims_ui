import { apiClient } from "../api_client/apiClient";
import {
  listMedicationTypesUrl,
  listMedicationsUrl,
  filterMedicationsUrl,
} from "../end_points/endpoints";

export const managementApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get all medication types
    getMedicationTypes: builder.query({
      query: () => ({
        url: listMedicationTypesUrl,
        method: "GET",
      }),
    }),

    // Get all medications
    getAllMedications: builder.query({
      query: () => ({
        url: listMedicationsUrl,
        method: "GET",
      }),
    }),

    // Filter medications by type
    filterMedications: builder.query({
      query: (typeId) => ({
        url: filterMedicationsUrl(typeId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetMedicationTypesQuery,
  useGetAllMedicationsQuery,
  useFilterMedicationsQuery,
} = managementApi;
