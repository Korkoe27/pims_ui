/**
 * Store Configuration
 *
 * Configures the Redux store with authentication, patient management, consultation, and other modules using RTK Query and persistence.
 */

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { authApi } from "../api/features/authApi"; // Authentication API slice
import { patientApi } from "../api/features/patientApi"; // Patient API slice
import { caseHistoryApi } from "../api/features/caseHistoryApi"; // Consultation API slice
import { visualAcuityApi } from "../api/features/visualAcuityApi"; // ✅ Visual Acuity API slice
import authReducer from "../slices/authSlice"; // Authentication state slice
import dashboardReducer from "../slices/dashboardSlice"; // Dashboard state slice
import patientReducer from "../slices/patientSlice"; // Patient state slice
import appointmentsReducer from "../slices/appointmentsSlice"; // Appointments state slice
import caseHistoryReducer from "../slices/consultationSlice"; // Consultation state slice
import clinicReducer from "../slices/clinicSlice"; // Clinic state slice

// Persistence configuration for the auth slice
const persistConfig = {
  key: "auth", // Key to store auth state in localStorage
  storage,
  whitelist: ["user"], // Persist only the 'user' field in the auth state
};

// Apply persistence to the auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Persisted local state for authentication
    dashboard: dashboardReducer, // Dashboard state slice
    patients: patientReducer, // Patient state slice
    appointments: appointmentsReducer, // Appointments state slice
    caseHistory: caseHistoryReducer, // Consultation state slice
    clinic: clinicReducer, // Clinic state slice
    [authApi.reducerPath]: authApi.reducer, // RTK Query reducer for authentication API
    [patientApi.reducerPath]: patientApi.reducer, // RTK Query reducer for patient API
    [caseHistoryApi.reducerPath]: caseHistoryApi.reducer, // RTK Query reducer for consultation API
    [visualAcuityApi.reducerPath]: visualAcuityApi.reducer, // ✅ RTK Query reducer for Visual Acuity API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    })
      .concat(authApi.middleware) // RTK Query middleware for authentication API
      .concat(patientApi.middleware) // RTK Query middleware for patient API
      .concat(caseHistoryApi.middleware) // RTK Query middleware for consultation API
      .concat(visualAcuityApi.middleware), // ✅ RTK Query middleware for Visual Acuity API
});

export const persistor = persistStore(store);

export default store;
