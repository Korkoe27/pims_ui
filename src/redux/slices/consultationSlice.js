import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  caseHistory: null,
  error: null,
  successMessage: null,
};

const consultationSlice = createSlice({
  name: "consultation",
  initialState,
  reducers: {
    setCaseHistory: (state, action) => {
      state.caseHistory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const { setCaseHistory, clearError, clearSuccessMessage } = consultationSlice.actions;
export default consultationSlice.reducer;
