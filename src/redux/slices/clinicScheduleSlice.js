// slices/clinicScheduleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDate: null,
  selectedStaff: [],       
  isModalOpen: false,       
};

const clinicScheduleSlice = createSlice({
  name: "clinicSchedule",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedStaff: (state, action) => {
      state.selectedStaff = action.payload;
    },
    toggleModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    resetScheduleForm: (state) => {
      state.selectedDate = null;
      state.selectedStaff = [];
      state.isModalOpen = false;
    },
  },
});

export const {
  setSelectedDate,
  setSelectedStaff,
  toggleModal,
  resetScheduleForm,
} = clinicScheduleSlice.actions;

export default clinicScheduleSlice.reducer;
