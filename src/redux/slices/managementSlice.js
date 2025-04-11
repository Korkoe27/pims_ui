import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMedicationType: null,
  medications: [],
};

const managementSlice = createSlice({
  name: "management",
  initialState,
  reducers: {
    setSelectedMedicationType: (state, action) => {
      state.selectedMedicationType = action.payload;
    },
    clearSelectedMedicationType: (state) => {
      state.selectedMedicationType = null;
    },
    setMedications: (state, action) => {
      state.medications = action.payload;
    },
  },
});

export const {
  setSelectedMedicationType,
  clearSelectedMedicationType,
  setMedications,
} = managementSlice.actions;

export default managementSlice.reducer;
