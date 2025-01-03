import { createSlice } from "@reduxjs/toolkit";

const clinicSlice = createSlice({
  name: "clinic",
  initialState: {
    selectedClinic: null, // Stores the currently selected clinic
  },
  reducers: {
    setSelectedClinic: (state, action) => {
      state.selectedClinic = action.payload;
    },
    resetSelectedClinic: (state) => {
      state.selectedClinic = null;
    },
  },
});

export const { setSelectedClinic, resetSelectedClinic } = clinicSlice.actions;

export default clinicSlice.reducer;
