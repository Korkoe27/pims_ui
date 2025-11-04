import { apiClient } from "../api_client/apiClient";
import {
  listMedicationTypesUrl,
  listMedicationsUrl,
  filterMedicationsUrl,
  managementPlanUrl,
  managementPlanByVersionUrl,
  caseManagementGuideUrl,       // → /management/case-guide/create/<id>/
  caseManagementGuideByVersionUrl, // → /management/case-guide/create/<id>/?consultation_version=<versionId>/
  updateCaseManagementGuideUrl, // → /management/case-guide/<id>/
  updateCaseManagementGuideByVersionUrl, // → /management/case-guide/<id>/?consultation_version=<versionId>/
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
      query: ({ appointmentId, versionId } = {}) => {
        if (versionId && appointmentId) {
          return {
            url: managementPlanByVersionUrl(appointmentId, versionId),
            method: "GET",
          };
        }
        if (appointmentId) {
          return {
            url: managementPlanUrl(appointmentId),
            method: "GET",
          };
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
    }),

    // ============================================================
    // 🔹 CREATE / UPDATE MANAGEMENT PLAN (POST)
    // ============================================================
    createManagementPlan: builder.mutation({
      /**
       * appointmentId: UUID or ID of appointment
       * versionId: consultation version ID
       * data: the full management plan payload
       */
      query: ({ appointmentId, versionId, data }) => ({
        url: managementPlanUrl(appointmentId),
        method: "POST",
        body: {
          ...data,
          consultation_version: versionId,
        },
        headers: { "Content-Type": "application/json" },
      }),
    }),

    // ============================================================
    // 🔹 FETCH CASE MANAGEMENT GUIDE (GET)
    // ============================================================
    getCaseManagementGuide: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        if (versionId && appointmentId) {
          return {
            url: caseManagementGuideByVersionUrl(appointmentId, versionId),
            method: "GET",
          };
        }
        if (appointmentId) {
          return {
            url: caseManagementGuideUrl(appointmentId),
            method: "GET",
          };
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: (result, error, { appointmentId }) => [
        { type: "CaseManagementGuide", id: appointmentId },
      ],
    }),

    // ============================================================
    // 🔹 UPDATE CASE MANAGEMENT GUIDE (PUT)
    // ============================================================
    updateCaseManagementGuide: builder.mutation({
      query: ({ appointmentId, versionId, data }) => {
        const url = versionId 
          ? updateCaseManagementGuideByVersionUrl(appointmentId, versionId)
          : updateCaseManagementGuideUrl(appointmentId);
        return {
          url,
          method: "PUT",
          body: {
            ...data,
            consultation_version: versionId,
          },
          headers: { "Content-Type": "application/json" },
        };
      },
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
