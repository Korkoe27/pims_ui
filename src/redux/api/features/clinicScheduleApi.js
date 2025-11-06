// features/clinicScheduleApi.js
import { apiClient } from "../api_client/apiClient";
import {
  clinicScheduleUrl,
  listScheduleStaffUrl,
  fetchClinicScheduleByDateUrl,
  availableStaffUrl,
} from "../end_points/endpoints";

export const clinicScheduleApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // GET: All clinic schedules or filter by date
    getClinicSchedules: builder.query({
      query: (date = null) => ({
        url: date ? fetchClinicScheduleByDateUrl(date) : clinicScheduleUrl,
        method: "GET",
      }),
    }),

    // GET: List of ALL staff (no filtering)
    getScheduleStaff: builder.query({
      query: () => ({
        url: listScheduleStaffUrl,
        method: "GET",
      }),
    }),

    // GET: List of AVAILABLE staff (excluding those on approved absence)
    getAvailableStaff: builder.query({
      query: (date = null) => ({
        url: availableStaffUrl(date),
        method: "GET",
      }),
    }),

    // POST: Create a new clinic schedule
    createClinicSchedule: builder.mutation({
      query: (scheduleData) => ({
        url: clinicScheduleUrl,
        method: "POST",
        body: scheduleData,
      }),
    }),
  }),
});

export const {
  useGetClinicSchedulesQuery,
  useGetScheduleStaffQuery,
  useGetAvailableStaffQuery,
  useCreateClinicScheduleMutation,
} = clinicScheduleApi;
