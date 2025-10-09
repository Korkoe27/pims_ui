import { apiClient } from "../api_client/apiClient";
import { TAGS } from "../tags/tags";
import {
  listConsultationsUrl,
  getConsultationUrl,
  updateConsultationUrl,
  deleteConsultationUrl,
  startConsultationUrl,
  transitionConsultationUrl,
  submitConsultationUrl,
  completeConsultationUrl,
  overrideConsultationUrl,
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  tagTypes: [TAGS.CONSULTATIONS],

  endpoints: (builder) => ({
    // ======================
    // Consultation Management
    // ======================

    // List consultations (with filters)
    getConsultations: builder.query({
      query: (params = {}) => ({
        url: listConsultationsUrl,
        method: "GET",
        params,
      }),
      providesTags: [TAGS.CONSULTATIONS],
    }),

    // Get consultation details
    getConsultation: builder.query({
      queryFn: (appointmentId) => {
        // Mock data for testing - return different consultations based on appointment ID
        const mockConsultations = {
          12345: {
            id: "cons_001",
            appointment_id: "12345",
            status: "Consultation In Progress",
            is_student_case: false,
            next_allowed_states: ["Exams Recorded", "Diagnosis Added"],
            permissions: {
              can_edit_exams: true,
              can_edit_diagnosis: true,
              can_edit_management: true,
              can_submit_for_review: false,
              can_grade: false,
              can_complete: true,
              can_override: false,
            },
            created_at: "2025-10-08T10:00:00Z",
            updated_at: "2025-10-08T10:30:00Z",
          },
          12346: {
            id: "cons_002",
            appointment_id: "12346",
            status: "Submitted For Review",
            is_student_case: true,
            next_allowed_states: ["Under Review"],
            permissions: {
              can_edit_exams: false,
              can_edit_diagnosis: false,
              can_edit_management: false,
              can_submit_for_review: false,
              can_grade: true,
              can_complete: true,
              can_override: true,
            },
            created_at: "2025-10-08T09:00:00Z",
            updated_at: "2025-10-08T09:45:00Z",
          },
          12347: {
            id: "cons_003",
            appointment_id: "12347",
            status: "Exams Recorded",
            is_student_case: true,
            next_allowed_states: ["Diagnosis Added", "Management Created"],
            permissions: {
              can_edit_exams: false,
              can_edit_diagnosis: true,
              can_edit_management: true,
              can_submit_for_review: true,
              can_grade: false,
              can_complete: false,
              can_override: false,
            },
            created_at: "2025-10-08T08:00:00Z",
            updated_at: "2025-10-08T08:30:00Z",
          },
        };

        const consultation = mockConsultations[appointmentId];
        if (consultation) {
          return { data: consultation };
        } else {
          // Default mock consultation for any appointment ID
          return {
            data: {
              id: `cons_${appointmentId}`,
              appointment_id: appointmentId,
              status: "Consultation In Progress",
              is_student_case: false,
              next_allowed_states: ["Exams Recorded", "Diagnosis Added"],
              permissions: {
                can_edit_exams: true,
                can_edit_diagnosis: true,
                can_edit_management: true,
                can_submit_for_review: false,
                can_grade: false,
                can_complete: true,
                can_override: false,
              },
              created_at: "2025-10-08T10:00:00Z",
              updated_at: "2025-10-08T10:30:00Z",
            },
          };
        }
      },
      providesTags: (result, error, consultationId) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
      ],
    }),

    // Update consultation
    updateConsultation: builder.mutation({
      query: ({ consultationId, data }) => ({
        url: updateConsultationUrl(consultationId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
        TAGS.CONSULTATIONS,
      ],
    }),

    // Delete consultation (admin only)
    deleteConsultation: builder.mutation({
      query: (consultationId) => ({
        url: deleteConsultationUrl(consultationId),
        method: "DELETE",
      }),
      invalidatesTags: [TAGS.CONSULTATIONS],
    }),

    // Start new consultation
    startConsultation: builder.mutation({
      queryFn: (data) => {
        // Mock successful consultation start
        return {
          data: {
            success: true,
            message: "Consultation started successfully",
            consultation: {
              id: `cons_${Date.now()}`,
              appointment_id: data.appointment_id,
              status: "Consultation In Progress",
              is_student_case: data.is_student_case || false,
              next_allowed_states: ["Exams Recorded", "Diagnosis Added"],
              permissions: {
                can_edit_exams: true,
                can_edit_diagnosis: true,
                can_edit_management: true,
                can_submit_for_review: false,
                can_grade: false,
                can_complete: true,
                can_override: false,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        };
      },
      invalidatesTags: [TAGS.CONSULTATIONS, TAGS.DASHBOARD],
    }),

    // Transition to new status
    transitionConsultation: builder.mutation({
      queryFn: ({ consultationId, data }) => {
        // Mock successful transition
        return {
          data: {
            success: true,
            message: `Successfully transitioned to ${data.new_status}`,
            consultation: {
              id: consultationId,
              status: data.new_status,
              updated_at: new Date().toISOString(),
            },
          },
        };
      },
      invalidatesTags: (result, error, { consultationId }) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
        TAGS.CONSULTATIONS,
      ],
    }),

    // Student submits for review
    submitConsultation: builder.mutation({
      queryFn: (consultationId) => {
        // Mock successful submission
        return {
          data: {
            success: true,
            message: "Consultation submitted for review successfully",
            consultation: {
              id: consultationId,
              status: "Submitted For Review",
              updated_at: new Date().toISOString(),
            },
          },
        };
      },
      invalidatesTags: (result, error, consultationId) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
        TAGS.CONSULTATIONS,
      ],
    }),

    // Complete consultation - call real backend endpoint
    completeConsultation: builder.mutation({
      query: (consultationId) => {
        // Allow callers to pass IDs that may have a local 'cons_' prefix
        // (mock data). The backend expects the raw UUID (no prefix).
        let raw = consultationId;
        if (consultationId && typeof consultationId === "object") {
          // support being passed an object like { consultationId: '...'}
          raw = consultationId.consultationId || consultationId.id || raw;
        }
        const id = typeof raw === "string" ? raw.replace(/^cons_/, "") : raw;
        return {
          url: completeConsultationUrl(id),
          method: "POST",
        };
      },
      invalidatesTags: (result, error, consultationId) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
        TAGS.CONSULTATIONS,
        TAGS.DASHBOARD,
      ],
    }),

    // Admin status override
    overrideConsultation: builder.mutation({
      query: ({ consultationId, data }) => ({
        url: overrideConsultationUrl(consultationId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { consultationId }) => [
        { type: TAGS.CONSULTATIONS, id: consultationId },
        TAGS.CONSULTATIONS,
      ],
    }),
  }),
});

export const {
  useGetConsultationsQuery,
  useGetConsultationQuery,
  useUpdateConsultationMutation,
  useDeleteConsultationMutation,
  useStartConsultationMutation,
  useTransitionConsultationMutation,
  useSubmitConsultationMutation,
  useCompleteConsultationMutation,
  useOverrideConsultationMutation,
} = consultationApi;
