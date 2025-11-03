import { apiClient } from "../api_client/apiClient";
import {
  createNewAppointmentUrl,
  fetchAppointmentsUrl,
  getAppointmentsDetailsUrl,
  markAppointmentCompletedUrl,
  getTodaysAppointmentUrl,
  fetchAppointmentTypesUrl,
  submitAppointmentForReviewUrl,
  fetchAppointmentGradingChecklistUrl, // optional: you can use this later
} from "../end_points/endpoints";

export const appointmentsApi = apiClient.injectEndpoints({
  tagTypes: ["Dashboard"], // ✅ for cache invalidation and dashboard updates

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

    // ✅ Create a new appointment
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: createNewAppointmentUrl,
        method: "POST",
        body: appointmentData,
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ Mark appointment as completed
    markAppointmentCompleted: builder.mutation({
      query: (appointmentId) => ({
        url: markAppointmentCompletedUrl(appointmentId),
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ Get today's appointments
    getTodaysAppointments: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: queryString
            ? `${getTodaysAppointmentUrl}?${queryString}`
            : getTodaysAppointmentUrl,
          method: "GET",
        };
      },
    }),

    // ✅ Fetch Appointment Types
    fetchAppointmentTypes: builder.query({
      query: (category) => ({
        url: category
          ? `${fetchAppointmentTypesUrl}?category=${encodeURIComponent(category)}`
          : fetchAppointmentTypesUrl,
        method: "GET",
      }),
      transformResponse: (resp) => {
        if (!Array.isArray(resp)) return [];
        return resp.map((t) => ({
          value: t.id,
          label: t.name,
          category: t.category,
          raw: t,
        }));
      },
    }),

    // ✅ Submit appointment for lecturer/supervisor review
    submitAppointmentForReview: builder.mutation({
      query: (appointmentId) => ({
        url: submitAppointmentForReviewUrl(appointmentId),
        method: "POST",
      }),
      invalidatesTags: ["Dashboard"],
    }),

    // ✅ (Optional) Fetch appointment grading checklist
    getAppointmentGradingChecklist: builder.query({
      query: (appointmentId) => ({
        url: fetchAppointmentGradingChecklistUrl(appointmentId),
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
  useFetchAppointmentTypesQuery,

  // Review flow
  useSubmitAppointmentForReviewMutation,
  useGetAppointmentGradingChecklistQuery,
} = appointmentsApi;
