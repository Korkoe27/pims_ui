import { createSlice } from "@reduxjs/toolkit";
import { patientApi } from "../api/features/patientApi";

// Initial State
const initialState = {
  patientsList: [], // List of all patients
  selectedPatient: null, // Detailed patient info
  searchResults: [], // Search results
  patientId: null, // Patient ID after creation
  error: null, // Error handling
  loading: false, // Loading state for API calls
  successMessage: null, // Success message for actions like create/update
};

// Patient Slice
const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // Reset all patient-related state
    resetPatientsState: (state) => {
      return { ...initialState };
    },
    // Set selected patient
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    // Store patient ID
    setPatientId: (state, action) => {
      state.patientId = action.payload;
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
    // Handle fetching all patients
    builder
      .addMatcher(patientApi.endpoints.getAllPatients.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        patientApi.endpoints.getAllPatients.matchFulfilled,
        (state, action) => {
          state.patientsList = action.payload;
          state.loading = false;
        }
      )
      .addMatcher(
        patientApi.endpoints.getAllPatients.matchRejected,
        (state, action) => {
          state.error = action.error?.message || "Failed to fetch patients";
          state.loading = false;
        }
      );

    // Handle searching patients
    builder
      .addMatcher(
        patientApi.endpoints.searchPatients.matchFulfilled,
        (state, action) => {
          state.searchResults = action.payload;
        }
      )
      .addMatcher(
        patientApi.endpoints.searchPatients.matchRejected,
        (state, action) => {
          state.error = action.error?.message || "Failed to search patients";
        }
      );

    // Handle fetching a single patient’s details
    builder
      .addMatcher(
        patientApi.endpoints.getPatientDetails.matchFulfilled,
        (state, action) => {
          state.selectedPatient = action.payload;
        }
      )
      .addMatcher(
        patientApi.endpoints.getPatientDetails.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message || "Failed to fetch patient details";
        }
      );

    // Handle creating a new patient
    builder
      .addMatcher(patientApi.endpoints.createPatient.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        patientApi.endpoints.createPatient.matchFulfilled,
        (state, action) => {
          state.successMessage = "Patient created successfully";

          // Ensure `patientsList` is always an array before pushing
          if (!Array.isArray(state.patientsList)) {
            state.patientsList = [];
          }

          state.patientsList.push(action.payload);
          state.patientId = action.payload.id;
          state.loading = false;
        }
      )
      .addMatcher(
        patientApi.endpoints.createPatient.matchRejected,
        (state, action) => {
          state.error = action.error?.message || "Failed to create patient";
          state.loading = false;
        }
      );

    // Handle updating patient details
    builder
      .addMatcher(
        patientApi.endpoints.updatePatientDetails.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        patientApi.endpoints.updatePatientDetails.matchFulfilled,
        (state, action) => {
          state.successMessage = "Patient updated successfully";

          // Update the patient in the list
          state.patientsList = state.patientsList.map((patient) =>
            patient.id === action.payload.id ? action.payload : patient
          );

          state.loading = false;
        }
      )
      .addMatcher(
        patientApi.endpoints.updatePatientDetails.matchRejected,
        (state, action) => {
          state.error =
            action.error?.message || "Failed to update patient details";
          state.loading = false;
        }
      );
  },
});

// Export Actions and Reducer
export const {
  resetPatientsState,
  setSelectedPatient,
  setPatientId,
  clearError,
  clearSuccessMessage,
} = patientSlice.actions;

export default patientSlice.reducer;
