/**
 * Dashboard Slice
 *
 * Manages the state for the dashboard, including patients and appointment statistics.
 */

import { createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../api/features/dashboardApi"; // Use the correct API slice

const initialState = {
  totalPatients: 0,
  pendingAppointments: 0,
  completedAppointments: 0,
  todayAppointments: {
    count: 0,
    data: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Reset dashboard state
    resetDashboardState: (state) => {
      state.totalPatients = 0;
      state.pendingAppointments = 0;
      state.completedAppointments = 0;
      state.todayAppointments = {
        count: 0,
        data: [],
      };
      state.error = null;
      state.loading = false;
    },

    // ✅ Add new appointment without needing a refresh or socket
    addNewAppointment: (state, action) => {
      state.todayAppointments.count += 1;
      state.todayAppointments.data.unshift(action.payload); // Add to beginning
      state.pendingAppointments += 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch Dashboard Data
    builder
      .addMatcher(
        dashboardApi.endpoints.getDashboardData.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        dashboardApi.endpoints.getDashboardData.matchFulfilled,
        (state, action) => {
          const {
            total_patients,
            pending_appointments,
            completed_appointments,
            today_appointments,
          } = action.payload;
          state.totalPatients = total_patients;
          state.pendingAppointments = pending_appointments;
          state.completedAppointments = completed_appointments;
          state.todayAppointments = today_appointments;
          state.loading = false;
        }
      )
      .addMatcher(
        dashboardApi.endpoints.getDashboardData.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.message || "Failed to fetch dashboard data";
        }
      );
  },
});

export const { resetDashboardState, addNewAppointment } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
