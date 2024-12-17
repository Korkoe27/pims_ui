// store.js
import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentsSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
  },
});
