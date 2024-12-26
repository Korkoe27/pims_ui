import { createSlice } from "@reduxjs/toolkit";
import { patientApi } from "../api/features/patientApi";

// Initial State
const initialState = {
  patientsList: [], // For storing all patients
  selectedPatient: null, // For holding detailed patient info
  searchResults: [], // For storing search results
  error: null, // For any error handling
  loading: false, // Loading state for patient-related actions
  successMessage: null, // Success message for actions like creating/updating a patient
};

// Patient Slice
const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    // Reset patients state
    resetPatientsState: (state) => {
      state.patientsList = [];
      state.selectedPatient = null;
      state.searchResults = [];
      state.error = null;
      state.loading = false;
      state.successMessage = null;
    },
    // Set selected patient
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
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
    // Use RTK Query matchers for the `patientApi` endpoints

    // Handle listAllPatients
    builder
      .addMatcher(patientApi.endpoints.getAllPatients.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(patientApi.endpoints.getAllPatients.matchFulfilled, (state, action) => {
        state.patientsList = action.payload;
        state.loading = false;
      })
      .addMatcher(patientApi.endpoints.getAllPatients.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch patients";
        state.loading = false;
      });

    // Handle searchPatients
    builder
      .addMatcher(patientApi.endpoints.searchPatients.matchFulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addMatcher(patientApi.endpoints.searchPatients.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to search patients";
      });

    // Handle fetchSinglePatientDetails
    builder
      .addMatcher(patientApi.endpoints.getPatientDetails.matchFulfilled, (state, action) => {
        state.selectedPatient = action.payload;
      })
      .addMatcher(patientApi.endpoints.getPatientDetails.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch patient details";
      });

    // Handle createNewPatient
    builder
      .addMatcher(patientApi.endpoints.createPatient.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(patientApi.endpoints.createPatient.matchFulfilled, (state, action) => {
        state.successMessage = "Patient created successfully";
        state.patientsList.push(action.payload); // Add new patient to the list
        state.loading = false;
      })
      .addMatcher(patientApi.endpoints.createPatient.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to create patient";
        state.loading = false;
      });

    // Handle updatePatientDetails
    builder
      .addMatcher(patientApi.endpoints.updatePatientDetails.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(patientApi.endpoints.updatePatientDetails.matchFulfilled, (state, action) => {
        state.successMessage = "Patient updated successfully";
        // Update the patient in the list
        state.patientsList = state.patientsList.map((patient) =>
          patient.id === action.payload.id ? action.payload : patient
        );
        state.loading = false;
      })
      .addMatcher(patientApi.endpoints.updatePatientDetails.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to update patient details";
        state.loading = false;
      });
  },
});

// Export Actions and Reducer
export const {
  resetPatientsState,
  setSelectedPatient,
  clearError,
  clearSuccessMessage,
} = patientSlice.actions;
export default patientSlice.reducer;
