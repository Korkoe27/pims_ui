/**
 * Appointment Mutations
 * 
 * Contains mutations for managing appointments.
 * 
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../baseurl";
import { createNewAppointmentUrl, fetchAppointmentsUrl, getAppointmentsDetailsUrl } from "../endpoints";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL, credentials: "include" }),
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: createNewAppointmentUrl,
        method: "POST",
        body: appointmentData,
      }),
    }),
    fetchAppointments: builder.query({
      query: () => ({
        url: fetchAppointmentsUrl,
        method: "GET",
      }),
    }),
    getAppointmentDetails: builder.query({
      query: (appointmentId) => ({
        url: getAppointmentsDetailsUrl(appointmentId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useFetchAppointmentsQuery,
  useGetAppointmentDetailsQuery,
} = appointmentApi;
