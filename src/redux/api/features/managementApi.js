import { apiClient } from "../api_client/apiClient";
import {
  listMedicationTypesUrl,
  listMedicationsUrl,
  filterMedicationsUrl,
  managementPlanUrl,
  caseManagementGuideUrl,
  updateCaseManagementGuideUrl,
  deleteCaseManagementGuideUrl,
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

    // Fetch the most recent management plan
    getManagementPlan: builder.query({
      query: (appointmentId) => ({
        url: managementPlanUrl(appointmentId),
        method: "GET",
      }),
    }),

    // Create a new management plan
    createManagementPlan: builder.mutation({
      query: ({ appointmentId, payload }) => ({
        url: managementPlanUrl(appointmentId),
        method: "POST",
        body: payload,
      }),
    }),

    // Get/Create Case Management Guide
    getCaseManagementGuide: builder.query({
      query: (appointmentId) => ({
        url: caseManagementGuideUrl(appointmentId),
        method: "GET",
      }),
      providesTags: (result, error, appointmentId) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),

    // Update Case Management Guide
    updateCaseManagementGuide: builder.mutation({
      query: ({ appointmentId, payload }) => ({
        url: updateCaseManagementGuideUrl(appointmentId),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { appointmentId }) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),

    // Delete Case Management Guide
    deleteCaseManagementGuide: builder.mutation({
      query: (appointmentId) => ({
        url: deleteCaseManagementGuideUrl(appointmentId),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, appointmentId) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),
  }),
});

export const {
  useGetMedicationTypesQuery,
  useGetAllMedicationsQuery,
  useFilterMedicationsQuery,
  useGetManagementPlanQuery,
  useCreateManagementPlanMutation,
  useGetCaseManagementGuideQuery,
  useUpdateCaseManagementGuideMutation,
  useDeleteCaseManagementGuideMutation,
} = managementApi;
