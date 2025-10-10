import { createSlice } from "@reduxjs/toolkit";
import { appointmentsApi } from "../api/features/appointmentsApi";

// Initial State
const initialState = {
  appointmentsList: [], // all appointments
  selectedAppointment: null, // details
  error: null,
  loading: false,
  successMessage: null,
};

// Appointment Slice
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    resetAppointmentsState: (state) => {
      state.appointmentsList = [];
      state.selectedAppointment = null;
      state.error = null;
      state.loading = false;
      state.successMessage = null;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // ========================
    // Get Appointments
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.getAppointments.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.getAppointments.matchFulfilled,
        (state, action) => {
          state.appointmentsList = action.payload;
          state.loading = false;
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.getAppointments.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message || "Failed to fetch appointments";
          state.loading = false;
        }
      );

    // ========================
    // Get Appointment Details
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.getAppointmentDetails.matchFulfilled,
        (state, action) => {
          state.selectedAppointment = action.payload;
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.getAppointmentDetails.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to fetch appointment details";
        }
      );

    // ========================
    // Create Appointment
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.createAppointment.matchFulfilled,
        (state) => {
          state.successMessage = "Appointment created successfully";
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.createAppointment.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to create appointment";
        }
      );

    // ========================
    // Mark Completed
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.markAppointmentCompleted.matchFulfilled,
        (state) => {
          state.successMessage = "Appointment marked as completed";
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.markAppointmentCompleted.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to mark appointment as completed";
        }
      );

    // ========================
    // Transition Appointment
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.transitionAppointment.matchFulfilled,
        (state, action) => {
          state.selectedAppointment = action.payload;
          state.successMessage = "Appointment transitioned successfully";
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.transitionAppointment.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to transition appointment";
        }
      );

    // ========================
    // Submit For Review
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.submitAppointmentForReview.matchFulfilled,
        (state, action) => {
          state.selectedAppointment = action.payload;
          state.successMessage = "Appointment submitted for review";
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.submitAppointmentForReview.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to submit appointment for review";
        }
      );

    // ========================
    // Flow Context
    // ========================
    builder
      .addMatcher(
        appointmentsApi.endpoints.getAppointmentFlowContext.matchFulfilled,
        (state, action) => {
          // merge flow-context into selectedAppointment
          state.selectedAppointment = {
            ...state.selectedAppointment,
            flowContext: action.payload,
          };
        }
      )
      .addMatcher(
        appointmentsApi.endpoints.getAppointmentFlowContext.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message ||
            "Failed to fetch appointment flow context";
        }
      );
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
