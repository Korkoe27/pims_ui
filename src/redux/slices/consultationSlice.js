import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Current consultation data
  currentConsultation: null,

  // Flow type identification
  // 'lecturer_consulting' | 'student_consulting' | 'lecturer_reviewing'
  flowType: null,

  // Flow state management
  flowState: null, // e.g. "Consultation In Progress"
  nextAllowedStates: [],

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

  // Loading state
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    // ========================================================
    // 🔹 Set or refresh the current consultation
    // ========================================================
    setCurrentConsultation: (state, action) => {
      const payload = action.payload || {};

      state.currentConsultation = payload;
      state.flowState = payload.flowState || payload.status || null;
      state.nextAllowedStates =
        payload.nextAllowedStates || payload.next_allowed_states || [];

      // ✅ flowType is now determined by the frontend (Consultation.jsx)
      state.flowType = payload.flowType || null;

      // ✅ Permissions are provided by useConsultationData
      if (payload.permissions) {
        state.permissions = { ...state.permissions, ...payload.permissions };
      }
    },

    // ========================================================
    // 🔹 Flow and permission updates
    // ========================================================
    setFlowState: (state, action) => {
      state.flowState = action.payload;
    },

    setNextAllowedStates: (state, action) => {
      state.nextAllowedStates = action.payload;
    },

    setPermissions: (state, action) => {
      state.permissions = { ...state.permissions, ...action.payload };
    },

    // ========================================================
    // 🔹 Transition handling (success, error, loading)
    // ========================================================
    setTransitioning: (state, action) => {
      state.isTransitioning = action.payload;
    },

    setTransitionError: (state, action) => {
      const payload = action.payload;
      if (!payload) {
        state.transitionError = null;
      } else if (typeof payload === "string") {
        state.transitionError = payload;
      } else if (typeof payload === "object") {
        if (typeof payload.detail === "string") {
          state.transitionError = payload.detail;
        } else if (payload.error && typeof payload.error === "string") {
          state.transitionError = payload.error;
        } else if (payload.message && typeof payload.message === "string") {
          state.transitionError = payload.message;
        } else {
          try {
            state.transitionError = JSON.stringify(payload);
          } catch {
            state.transitionError = String(payload);
          }
        }
      } else {
        state.transitionError = String(payload);
      }
      state.isTransitioning = false;
    },

    setTransitionSuccess: (state, action) => {
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
          } catch {
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

    // ========================================================
    // 🔹 Loading and general error states
    // ========================================================
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

    // ========================================================
    // 🔹 Reset consultation state (on exit or logout)
    // ========================================================
    resetConsultation: (state) => {
      state.currentConsultation = null;
      state.flowType = null;
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
