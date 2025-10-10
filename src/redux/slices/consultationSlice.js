import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Current consultation data
  currentConsultation: null,

  // Flow type identification
  flowType: null, // 'lecturer_consulting' | 'student_consulting' | 'lecturer_reviewing'

  // Flow state management
  flowState: null, // Current state in the consultation flow
  nextAllowedStates: [], // States that can be transitioned to

  // Permission flags
  permissions: {
    can_edit_exams: false,
    can_edit_diagnosis: false,
    can_edit_management: false,
    can_submit_for_review: false,
    can_grade: false,
    can_complete: false,
    can_override: false,
  },

  // UI state
  isTransitioning: false,
  transitionError: null,
  transitionSuccess: null,

  // Loading states
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    // Set current consultation
    setCurrentConsultation: (state, action) => {
      state.currentConsultation = action.payload;
      state.flowState = action.payload?.status || null;
      state.nextAllowedStates = action.payload?.next_allowed_states || [];

      // ✅ Prefer UI-derived flow type from the hook; fall back softly
      state.flowType =
        action.payload?.uiFlowType ??
        action.payload?.flowType ?? // if you ever send it
        state.flowType; // leave unchanged if not provided

      // Update permissions based on consultation data
      if (action.payload?.permissions) {
        state.permissions = {
          ...state.permissions,
          ...action.payload.permissions,
        };
      }
    },

    // Update flow state
    setFlowState: (state, action) => {
      state.flowState = action.payload;
    },

    // Update next allowed states
    setNextAllowedStates: (state, action) => {
      state.nextAllowedStates = action.payload;
    },

    // Update permissions
    setPermissions: (state, action) => {
      state.permissions = {
        ...state.permissions,
        ...action.payload,
      };
    },

    // Transition state management
    setTransitioning: (state, action) => {
      state.isTransitioning = action.payload;
    },

    setTransitionError: (state, action) => {
      // Normalize errors to strings to avoid rendering raw objects in the UI
      const payload = action.payload;
      if (!payload) {
        state.transitionError = null;
      } else if (typeof payload === "string") {
        state.transitionError = payload;
      } else if (typeof payload === "object") {
        // Prefer `detail` if present, otherwise fallback to joined keys or JSON
        if (typeof payload.detail === "string") {
          state.transitionError = payload.detail;
        } else if (payload.error && typeof payload.error === "string") {
          state.transitionError = payload.error;
        } else if (payload.message && typeof payload.message === "string") {
          state.transitionError = payload.message;
        } else {
          try {
            state.transitionError = JSON.stringify(payload);
          } catch (e) {
            state.transitionError = String(payload);
          }
        }
      } else {
        state.transitionError = String(payload);
      }
      state.isTransitioning = false;
    },

    setTransitionSuccess: (state, action) => {
      // Normalize success messages similarly
      const payload = action.payload;
      if (!payload) {
        state.transitionSuccess = null;
      } else if (typeof payload === "string") {
        state.transitionSuccess = payload;
      } else if (typeof payload === "object") {
        if (typeof payload.detail === "string") {
          state.transitionSuccess = payload.detail;
        } else if (payload.message && typeof payload.message === "string") {
          state.transitionSuccess = payload.message;
        } else {
          try {
            state.transitionSuccess = JSON.stringify(payload);
          } catch (e) {
            state.transitionSuccess = String(payload);
          }
        }
      } else {
        state.transitionSuccess = String(payload);
      }
      state.isTransitioning = false;
    },

    clearTransitionMessages: (state) => {
      state.transitionError = null;
      state.transitionSuccess = null;
    },

    // Loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Reset consultation state
    resetConsultation: (state) => {
      state.currentConsultation = null;
      state.flowState = null;
      state.nextAllowedStates = [];
      state.permissions = {
        can_edit_exams: false,
        can_edit_diagnosis: false,
        can_edit_management: false,
        can_submit_for_review: false,
        can_grade: false,
        can_complete: false,
        can_override: false,
      };
      state.isTransitioning = false;
      state.transitionError = null;
      state.transitionSuccess = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentConsultation,
  setFlowState,
  setNextAllowedStates,
  setPermissions,
  setTransitioning,
  setTransitionError,
  setTransitionSuccess,
  clearTransitionMessages,
  setLoading,
  setError,
  clearError,
  resetConsultation,
} = consultationSlice.actions;

export default consultationSlice.reducer;
