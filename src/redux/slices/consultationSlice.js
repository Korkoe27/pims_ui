import { createSlice } from "@reduxjs/toolkit";
import { consultationApi } from "../api/features/consultationApi";

// Initial State
const initialState = {
  caseHistory: null,
  visualAcuity: null,
  externals: null,
  internals: null,
  refraction: null,
  extraTests: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Consultation Slice
const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    // Reset the consultation state
    resetConsultationState: (state) => {
      state.caseHistory = null;
      state.visualAcuity = null;
      state.externals = null;
      state.internals = null;
      state.refraction = null;
      state.extraTests = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
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
    // Case History
    builder
      .addMatcher(consultationApi.endpoints.fetchCaseHistory.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchCaseHistory.matchFulfilled, (state, action) => {
        state.caseHistory = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchCaseHistory.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch case history";
        state.loading = false;
      });

    // Visual Acuity
    builder
      .addMatcher(consultationApi.endpoints.fetchVisualAcuity.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchVisualAcuity.matchFulfilled, (state, action) => {
        state.visualAcuity = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchVisualAcuity.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch visual acuity";
        state.loading = false;
      });

    // Externals
    builder
      .addMatcher(consultationApi.endpoints.fetchExternals.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchExternals.matchFulfilled, (state, action) => {
        state.externals = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchExternals.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch externals";
        state.loading = false;
      });

    // Internals
    builder
      .addMatcher(consultationApi.endpoints.fetchInternals.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchInternals.matchFulfilled, (state, action) => {
        state.internals = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchInternals.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch internals";
        state.loading = false;
      });

    // Refraction
    builder
      .addMatcher(consultationApi.endpoints.fetchRefraction.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchRefraction.matchFulfilled, (state, action) => {
        state.refraction = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchRefraction.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch refraction";
        state.loading = false;
      });

    // Extra Tests
    builder
      .addMatcher(consultationApi.endpoints.fetchExtraTests.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(consultationApi.endpoints.fetchExtraTests.matchFulfilled, (state, action) => {
        state.extraTests = action.payload;
        state.loading = false;
      })
      .addMatcher(consultationApi.endpoints.fetchExtraTests.matchRejected, (state, action) => {
        state.error = action.error?.message || "Failed to fetch extra tests";
        state.loading = false;
      });
  },
});

// Export Actions and Reducer
export const { resetConsultationState, clearError, clearSuccessMessage } = consultationSlice.actions;
export default consultationSlice.reducer;
