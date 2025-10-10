import { apiClient } from "../api_client/apiClient";
import {
  createNewAppointmentUrl,
  fetchAppointmentsUrl,
  getAppointmentsDetailsUrl,
  markAppointmentCompletedUrl,
  getTodaysAppointmentUrl,
  // 👇 new ones
  transitionAppointmentUrl,
  submitAppointmentForReviewUrl,
  flowContextAppointmentUrl,
} from "../end_points/endpoints";

export const appointmentsApi = apiClient.injectEndpoints({
  tagTypes: ["Dashboard"], // ✅ Register tag used by consumers like Sidebar/Dashboard

  endpoints: (builder) => ({
    // ======================
    // Appointments
    // ======================

    // Fetch all appointments
    getAppointments: builder.query({
      query: ({ page = 1, page_size = 5 }) => ({
        url: fetchAppointmentsUrl,
        method: "GET",
        params: { page, page_size },
      }),
    }),

    // Fetch single appointment details
    getAppointmentDetails: builder.query({
      query: (appointmentId) => ({
        url: getAppointmentsDetailsUrl(appointmentId),
        method: "GET",
      }),
    }),

    // ✅ Create a new appointment and invalidate dashboard
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: createNewAppointmentUrl,
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Dashboard"], // ✅ Refetch dashboard
    }),

    // ✅ Mark appointment as completed and refresh dashboard
    markAppointmentCompleted: builder.mutation({
      query: (appointmentId) => ({
        url: markAppointmentCompletedUrl(appointmentId),
        method: "PATCH",
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ Get today's appointments
    getTodaysAppointments: builder.query({
      query: () => ({
        url: getTodaysAppointmentUrl,
        method: "GET",
      }),
    }),

    // ======================
    // Flow Endpoints
    // ======================

    // ✅ Transition appointment (FSM move forward/backward)
    transitionAppointment: builder.mutation({
      query: ({ appointmentId, body }) => ({
        url: transitionAppointmentUrl(appointmentId),
        method: "POST",
        body, // optional: { to_status, reason }
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ Submit appointment for review
    submitAppointmentForReview: builder.mutation({
      query: (appointmentId) => ({
        url: submitAppointmentForReviewUrl(appointmentId),
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ Fetch flow context (allowed transitions, role perms)
    getAppointmentFlowContext: builder.query({
      query: (appointmentId) => ({
        url: flowContextAppointmentUrl(appointmentId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  // Appointments
  useGetAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useGetTodaysAppointmentsQuery,
  useCreateAppointmentMutation,
  useMarkAppointmentCompletedMutation,

  // Flow
  useTransitionAppointmentMutation,
  useSubmitAppointmentForReviewMutation,
  useGetAppointmentFlowContextQuery,
} = appointmentsApi;
