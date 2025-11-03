import { createSlice } from "@reduxjs/toolkit";
import { consultationsApi } from "../api/features/consultationsApi";

const initialState = {
  // 🔹 Core consultation context
  currentConsultation: null,
  versionId: null,
  versionType: null,
  flowType: null,
  isFinal: false,

  // 🔹 Permissions (full frontend keys)
  permissions: {
    canCreateAppointment: false,
    canViewAppointments: false,
    canUpdateAppointment: false,
    canDeleteAppointment: false,

    canViewClinicSchedule: false,
    canCreateClinicSchedule: false,
    canUpdateClinicSchedule: false,
    canDeleteClinicSchedule: false,

    canAddPatient: false,
    canViewPatients: false,
    canUpdatePatient: false,
    canDeletePatient: false,

    canStartConsultation: false,
    canViewConsultations: false,
    canEditConsultations: false,
    canSubmitConsultations: false,
    canCompleteConsultations: false,
    canGradeStudents: false,

    canViewGrades: false,
    canCreateAbsentRequest: false,
    canViewAbsentRequests: false,
    canUpdateAbsentRequests: false,
    canApproveAbsentRequests: false,

    canGenerateReports: false,
    canViewReports: false,
    canExportReports: false,

    canManageUsers: false,
    canViewAuditLogs: false,
  },

  // 🔹 Derived role flags
  derivedAccess: {
    isStudent: false,
    isLecturer: false,
    isClinician: false,
  },

  // 🔹 Transition and loading states
  isTransitioning: false,
  transitionError: null,
  transitionSuccess: null,

  // 🔹 General loading/error
  isLoading: false,
  error: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    // ========================================================
    // 🔹 Set the active consultation (manual)
    // ========================================================
    setCurrentConsultation: (state, action) => {
      const payload = action.payload || {};
      state.currentConsultation = payload;
      state.versionId = payload.id || payload.versionId || payload.version_id || null;
      state.versionType = payload.versionType || payload.version_type || null;
      state.flowType = payload.flowType || null;
      state.isFinal = payload.isFinal || payload.is_final || false;

      if (payload.permissions) {
        state.permissions = { ...state.permissions, ...payload.permissions };
        state.derivedAccess.isLecturer = payload.permissions.canGradeStudents || false;
        state.derivedAccess.isClinician = payload.permissions.canCompleteConsultations || false;
        state.derivedAccess.isStudent =
          payload.permissions.canStartConsultation &&
          !state.derivedAccess.isLecturer &&
          !state.derivedAccess.isClinician;
      }
    },

    // ========================================================
    // 🔹 Flow type & permissions
    // ========================================================
    setFlowType: (state, action) => {
      state.flowType = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = { ...state.permissions, ...action.payload };
      state.derivedAccess.isLecturer = state.permissions.canGradeStudents || false;
      state.derivedAccess.isClinician = state.permissions.canCompleteConsultations || false;
      state.derivedAccess.isStudent =
        state.permissions.canStartConsultation &&
        !state.derivedAccess.isLecturer &&
        !state.derivedAccess.isClinician;
    },

    // ========================================================
    // 🔹 Transition Handling
    // ========================================================
    setTransitioning: (state, action) => {
      state.isTransitioning = action.payload;
    },
    setTransitionError: (state, action) => {
      state.transitionError = typeof action.payload === "string"
        ? action.payload
        : JSON.stringify(action.payload);
      state.isTransitioning = false;
    },
    setTransitionSuccess: (state, action) => {
      state.transitionSuccess = typeof action.payload === "string"
        ? action.payload
        : JSON.stringify(action.payload);
      state.isTransitioning = false;
    },
    clearTransitionMessages: (state) => {
      state.transitionError = null;
      state.transitionSuccess = null;
    },

    // ========================================================
    // 🔹 General loading/error
    // ========================================================
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // ========================================================
    // 🔹 Reset all
    // ========================================================
    resetConsultation: () => initialState,
  },

  // ============================================================
  // 🔹 Auto-update consultation state on RTK Query success
  // ============================================================
  extraReducers: (builder) => {
    // When /start/ consultation succeeds
    builder.addMatcher(
      consultationsApi.endpoints.startConsultation.matchFulfilled,
      (state, { payload }) => {
        state.currentConsultation = payload;
        state.versionId = payload.id || payload.versionId || payload.version_id || null;
        state.versionType = payload.versionType || payload.version_type || null;
        state.isFinal = payload.isFinal || payload.is_final || false;
      }
    );

    // When /finalize/ consultation succeeds
    builder.addMatcher(
      consultationsApi.endpoints.finalizeConsultation.matchFulfilled,
      (state, { payload }) => {
        state.isFinal = true;
      }
    );
  },
});

export const {
  setCurrentConsultation,
  setFlowType,
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
