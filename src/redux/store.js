import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./slices/appointmentSlice";
import patientReducer from "./slices/patientSlice";

const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    patient: patientReducer,
  },
});

export default store;
