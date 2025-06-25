/**
 * Store Configuration
 *
 * Configures the Redux store with authentication, patient management, consultation, and other modules using RTK Query and persistence.
 */

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage

// API slices
import { authApi } from "../api/features/authApi";
import { patientApi } from "../api/features/patientApi";
import { caseHistoryApi } from "../api/features/caseHistoryApi";
import { visualAcuityApi } from "../api/features/visualAcuityApi";
import { diagnosisApi } from "../api/features/diagnosisApi";
import { managementApi } from "../api/features/managementApi";
import { dashboardApi } from "../api/features/dashboardApi"; // ✅ NEW
import { appointmentsApi } from "../api/features/appointmentsApi"; // ✅ NEW

// State slices
import authReducer from "../slices/authSlice";
import dashboardReducer from "../slices/dashboardSlice";
import patientReducer from "../slices/patientSlice";
import appointmentsReducer from "../slices/appointmentsSlice";
import caseHistoryReducer from "../slices/consultationSlice";
import clinicReducer from "../slices/clinicSlice";
import diagnosisReducer from "../slices/diagnosisSlice";
import managementReducer from "../slices/managementSlice";

// Persistence configuration for the auth slice
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Persist only the 'user' field in the auth state
};

// Apply persistence to the auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    patients: patientReducer,
    appointments: appointmentsReducer,
    caseHistory: caseHistoryReducer,
    clinic: clinicReducer,
    diagnosis: diagnosisReducer,
    management: managementReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [caseHistoryApi.reducerPath]: caseHistoryApi.reducer,
    [visualAcuityApi.reducerPath]: visualAcuityApi.reducer,
    [diagnosisApi.reducerPath]: diagnosisApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer, // ✅ ADDED
    [appointmentsApi.reducerPath]: appointmentsApi.reducer, // ✅ ADDED
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(patientApi.middleware)
      .concat(caseHistoryApi.middleware)
      .concat(visualAcuityApi.middleware)
      .concat(diagnosisApi.middleware)
      .concat(managementApi.middleware)
      .concat(dashboardApi.middleware) // ✅ ADDED
      .concat(appointmentsApi.middleware), // ✅ ADDED
});

export const persistor = persistStore(store);

export default store;
