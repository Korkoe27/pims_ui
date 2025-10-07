import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  caseHistory: null,
  visualAcuity: null, // ✅ Added Visual Acuity state
  error: null,
  successMessage: null,

  // New consultation flow state
  consultationId: null,
  status: null,
  role: null,
  permissions: {
    can_edit_exams: false,
    can_edit_diagnosis: false,
    can_edit_management: false,
    can_edit_cmg: false,
    can_add_logs: false,
    requires_grading: false,
    can_submit_for_review: false,
    can_complete: false,
  },
  next_allowed_states: [],
  sectionPresence: {
    has_exams: false,
    has_diagnosis: false,
    has_management: false,
    has_cmg: false,
    has_logs: false,
  },
  submitted_at: null,
  completed_at: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    // ✅ Case History Actions
    setCaseHistory: (state, action) => {
      state.caseHistory = action.payload;
    },

    // ✅ Visual Acuity Actions
    setVisualAcuity: (state, action) => {
      state.visualAcuity = action.payload;
    },

    // New consultation actions
    setConsultationData: (state, action) => {
      const data = action.payload;
      state.consultationId = data.id;
      state.status = data.status;
      state.role = data.role;
      state.permissions = {
        can_edit_exams: data.can_edit_exams || false,
        can_edit_diagnosis: data.can_edit_diagnosis || false,
        can_edit_management: data.can_edit_management || false,
        can_edit_cmg: data.can_edit_cmg || false,
        can_add_logs: data.can_add_logs || false,
        requires_grading: data.requires_grading || false,
        can_submit_for_review: data.can_submit_for_review || false,
        can_complete: data.can_complete || false,
      };
      state.next_allowed_states = data.next_allowed_states || [];
      state.sectionPresence = {
        has_exams: data.has_exams || false,
        has_diagnosis: data.has_diagnosis || false,
        has_management: data.has_management || false,
        has_cmg: data.has_cmg || false,
        has_logs: data.has_logs || false,
      };
      state.submitted_at = data.submitted_at;
      state.completed_at = data.completed_at;
    },

    clearConsultationData: (state) => {
      state.consultationId = null;
      state.status = null;
      state.role = null;
      state.permissions = initialState.permissions;
      state.next_allowed_states = [];
      state.sectionPresence = initialState.sectionPresence;
      state.submitted_at = null;
      state.completed_at = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const {
  setCaseHistory,
  setVisualAcuity,
  setConsultationData,
  clearConsultationData,
  clearError,
  clearSuccessMessage,
} = consultationSlice.actions;

export default consultationSlice.reducer;
