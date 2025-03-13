import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  caseHistory: null,
  visualAcuity: null, // ✅ Added Visual Acuity state
  error: null,
  successMessage: null,
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

    clearError: (state) => {
      state.error = null;
    },

    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const { setCaseHistory, setVisualAcuity, clearError, clearSuccessMessage } =
  consultationSlice.actions;

export default consultationSlice.reducer;
