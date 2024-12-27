import { createSlice } from "@reduxjs/toolkit";
import { appointmentsApi } from "../api/features/appointmentsApi"

// Initial State
const initialState = {
  appointmentsList: [], // For storing all appointments
  selectedAppointment: null, // For holding details of a selected appointment
  error: null, // For any error handling
  loading: false, // Loading state for appointment-related actions
  successMessage: null, // Success message for actions like creating/updating an appointment
};

// Appointment Slice
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    // Reset appointments state
    resetAppointmentsState: (state) => {
      state.appointmentsList = [];
      state.selectedAppointment = null;
      state.error = null;
      state.loading = false;
      state.successMessage = null;
    },
    // Set selected appointment
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Clear success message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Use RTK Query matchers for the `appointmentsApi` endpoints

    // Handle getAppointments
    builder
      .addMatcher(appointmentsApi.endpoints.getAppointments.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(appointmentsApi.endpoints.getAppointments.matchFulfilled, (state, action) => {
        state.appointmentsList = action.payload;
        state.loading = false;
      })
      .addMatcher(appointmentsApi.endpoints.getAppointments.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch appointments";
        state.loading = false;
      });

    // Handle getAppointmentDetails
    builder
      .addMatcher(appointmentsApi.endpoints.getAppointmentDetails.matchFulfilled, (state, action) => {
        state.selectedAppointment = action.payload;
      })
      .addMatcher(appointmentsApi.endpoints.getAppointmentDetails.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch appointment details";
      });
  },
});

// Export Actions and Reducer
export const {
  resetAppointmentsState,
  setSelectedAppointment,
  clearError,
  clearSuccessMessage,
} = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
