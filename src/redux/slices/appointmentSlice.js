import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    currentAppointment: null,
    appointments: [],
  },
  reducers: {
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    setCurrentAppointment(state, action) {
      state.currentAppointment = action.payload;
    },
  },
});

export const { setAppointments, setCurrentAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
