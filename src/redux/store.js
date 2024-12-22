/**
 * Store Configuration
 *
 * Configures the Redux store with authentication and API slices.
 *
 * Author: Solomon Edziah
 * Date: 2024-12-22
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { patientApi } from "../services/client/mutations/patient-mutations";
import { appointmentApi } from "../services/client/mutations/appointment-mutations";
import { examinationApi } from "../services/client/mutations/examination-mutations";
import { authApi } from "../services/client/mutations/auth-mutations";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Reducer for authentication state
    [patientApi.reducerPath]: patientApi.reducer, // Patient API slice
    [appointmentApi.reducerPath]: appointmentApi.reducer, // Appointment API slice
    [examinationApi.reducerPath]: examinationApi.reducer, // Examination API slice
    [authApi.reducerPath]: authApi.reducer, // Authentication API slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(patientApi.middleware)
      .concat(appointmentApi.middleware)
      .concat(examinationApi.middleware)
      .concat(authApi.middleware),
});

export default store;
