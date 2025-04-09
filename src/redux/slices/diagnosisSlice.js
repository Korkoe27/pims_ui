import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDiagnosis: null,
  diagnosesList: [],
};

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {
    setSelectedDiagnosis: (state, action) => {
      state.selectedDiagnosis = action.payload;
    },
    clearSelectedDiagnosis: (state) => {
      state.selectedDiagnosis = null;
    },
    setDiagnosesList: (state, action) => {
      state.diagnosesList = action.payload;
    },
  },
});

export const {
  setSelectedDiagnosis,
  clearSelectedDiagnosis,
  setDiagnosesList,
} = diagnosisSlice.actions;

export default diagnosisSlice.reducer;
