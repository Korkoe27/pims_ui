import { createSlice } from "@reduxjs/toolkit";

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
    addNewAppointment: (state, action) => {
      const newAppt = action.payload;
      const isToday =
        new Date(newAppt.appointment_date).toDateString() ===
        new Date().toDateString();

      if (!isToday) return;

      const alreadyExists = state.todayAppointments.data.some(
        (appt) => appt.id === newAppt.id
      );

      if (!alreadyExists) {
        state.todayAppointments.data.unshift(newAppt);
        state.todayAppointments.count += 1;

        if (newAppt.status === "Scheduled") {
          state.pendingAppointments += 1;
        }

        if (newAppt.status === "Consultation Completed") {
          state.completedAppointments += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type === "api/executeQuery/pending" &&
          action.meta.arg.endpointName === "getDashboardData",
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type === "api/executeQuery/fulfilled" &&
          action.meta.arg.endpointName === "getDashboardData",
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
        (action) =>
          action.type === "api/executeQuery/rejected" &&
          action.meta.arg.endpointName === "getDashboardData",
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
