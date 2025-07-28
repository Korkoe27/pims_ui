import { apiClient } from "../api_client/apiClient";
import {
  createNewAppointmentUrl,
  fetchAppointmentsUrl,
  getAppointmentsDetailsUrl,
  markAppointmentCompletedUrl,
  getTodaysAppointmentUrl,
} from "../end_points/endpoints";

export const appointmentsApi = apiClient.injectEndpoints({
  tagTypes: ["Dashboard"], // ✅ Register tag used by consumers like Sidebar/Dashboard

  endpoints: (builder) => ({
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
      invalidatesTags: ["Dashboard"], // ✅ Triggers background refetch of useGetDashboardDataQuery()
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
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useGetTodaysAppointmentsQuery,
  useCreateAppointmentMutation,
  useMarkAppointmentCompletedMutation,
} = appointmentsApi;
