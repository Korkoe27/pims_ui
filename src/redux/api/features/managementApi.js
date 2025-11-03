import { apiClient } from "../api_client/apiClient";
import {
  listMedicationTypesUrl,
  listMedicationsUrl,
  filterMedicationsUrl,
  managementPlanUrl,
  caseManagementGuideUrl,       // → /management/case-guide/create/<id>/
  updateCaseManagementGuideUrl, // → /management/case-guide/<id>/
  deleteCaseManagementGuideUrl, // → /management/case-guide/<id>/
} from "../end_points/endpoints";

/**
 * RTK Query slice for all Management-related API calls:
 * - Medication & MedicationType lists
 * - Management Plan create/fetch
 * - Case Management Guide CRUD
 */
export const managementApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================================
    // 🔹 MEDICATION TYPES
    // ============================================================
    getMedicationTypes: builder.query({
      query: () => ({
        url: listMedicationTypesUrl,
        method: "GET",
      }),
    }),

    // ============================================================
    // 🔹 ALL MEDICATIONS
    // ============================================================
    getAllMedications: builder.query({
      query: () => ({
        url: listMedicationsUrl,
        method: "GET",
      }),
    }),

    // ============================================================
    // 🔹 FILTER MEDICATIONS BY TYPE
    // ============================================================
    filterMedications: builder.query({
      query: (typeId) => ({
        url: filterMedicationsUrl(typeId),
        method: "GET",
      }),
    }),

    // ============================================================
    // 🔹 FETCH MANAGEMENT PLAN (GET)
    // ============================================================
    getManagementPlan: builder.query({
      query: (appointmentId) => ({
        url: managementPlanUrl(appointmentId),
        method: "GET",
      }),
    }),

    // ============================================================
    // 🔹 CREATE / UPDATE MANAGEMENT PLAN (POST)
    // ============================================================
    createManagementPlan: builder.mutation({
      /**
       * appointmentId: UUID or ID of appointment
       * data: the full management plan payload
       */
      query: ({ appointmentId, data }) => ({
        url: managementPlanUrl(appointmentId),
        method: "POST",
        body: data, // ✅ must be 'body', not 'data'
        headers: { "Content-Type": "application/json" },
      }),
    }),

    // ============================================================
    // 🔹 FETCH CASE MANAGEMENT GUIDE (GET)
    // ============================================================
    getCaseManagementGuide: builder.query({
      query: (appointmentId) => ({
        url: caseManagementGuideUrl(appointmentId), // /management/case-guide/create/<id>/
        method: "GET",
      }),
      providesTags: (result, error, appointmentId) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),

    // ============================================================
    // 🔹 UPDATE CASE MANAGEMENT GUIDE (PUT)
    // ============================================================
    updateCaseManagementGuide: builder.mutation({
      query: ({ appointmentId, data }) => ({
        url: updateCaseManagementGuideUrl(appointmentId), // /management/case-guide/<id>/
        method: "PUT",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { appointmentId }) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),

    // ============================================================
    // 🔹 DELETE CASE MANAGEMENT GUIDE (DELETE)
    // ============================================================
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
