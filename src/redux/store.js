// store.js
import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentsSlice";
import authReducer from "./slices/authSlice"

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    auth: authReducer,
  },
});
