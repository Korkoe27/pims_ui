import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  grading: null,
  loading: false,
  error: null,
  gradingHistory: [],
};

const gradingSlice = createSlice({
  name: "grading",
  initialState,
  reducers: {
    setGrading: (state, action) => {
      state.grading = action.payload;
      state.error = null;
    },
    setGradingLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGradingError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addToGradingHistory: (state, action) => {
      state.gradingHistory.push(action.payload);
    },
    clearGrading: (state) => {
      state.grading = null;
      state.error = null;
      state.loading = false;
    },
    updateGrading: (state, action) => {
      state.grading = {
        ...state.grading,
        ...action.payload,
      };
    },
  },
});

export const {
  setGrading,
  setGradingLoading,
  setGradingError,
  addToGradingHistory,
  clearGrading,
  updateGrading,
} = gradingSlice.actions;

export default gradingSlice.reducer;
