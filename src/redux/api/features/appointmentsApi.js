import { apiClient } from "../api_client/apiClient";
import {
  createNewAppointmentUrl,
  fetchAppointmentsUrl,
  getAppointmentsDetailsUrl,
} from "../end_points/endpoints";

export const appointmentsApi = apiClient.injectEndpoints({
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

    // Create a new appointment
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: createNewAppointmentUrl,
        method: "POST",
        body: appointmentData,
      }),
    }),
  }),
});

// Export hooks generated by RTK Query
export const {
  useGetAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useCreateAppointmentMutation,
} = appointmentsApi;
