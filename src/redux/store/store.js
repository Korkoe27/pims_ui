// src/redux/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ API slices
import {
  authApi,
  patientApi,
  caseHistoryApi,
  visualAcuityApi,
  diagnosisApi,
  managementApi,
  dashboardApi,
  appointmentsApi,
  absentRequestApi,
  gradingApi,
  consultationApi,
} from "../api/features";

// ✅ State slices
import authReducer from "../slices/authSlice";
import dashboardReducer from "../slices/dashboardSlice";
import gradingReducer from "../slices/gradingSlice";
import patientReducer from "../slices/patientSlice";
import appointmentsReducer from "../slices/appointmentsSlice";
import consultationReducer from "../slices/consultationSlice";
import clinicReducer from "../slices/clinicSlice";
import diagnosisReducer from "../slices/diagnosisSlice";
import managementReducer from "../slices/managementSlice";
import absentRequestReducer from "../slices/absentRequestSlice";

// -----------------------------------------
// 🧾 PERSIST CONFIGURATION
// -----------------------------------------
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // only persist the user info
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// -----------------------------------------
// 🧩 API MIDDLEWARES (deduplicated)
// -----------------------------------------
const apiMiddlewares = [
  authApi.middleware,
  patientApi.middleware,
  caseHistoryApi.middleware,
  visualAcuityApi.middleware,
  diagnosisApi.middleware,
  managementApi.middleware,
  dashboardApi.middleware,
  appointmentsApi.middleware,
  absentRequestApi.middleware,
  gradingApi.middleware,
  consultationApi.middleware,
];

// -----------------------------------------
// 🧠 STORE SETUP
// -----------------------------------------
export const store = configureStore({
  reducer: {
    // Core reducers
    auth: persistedAuthReducer,
    dashboard: dashboardReducer,
    patients: patientReducer,
    appointments: appointmentsReducer,
    consultation: consultationReducer,
    clinic: clinicReducer,
    diagnosis: diagnosisReducer,
    management: managementReducer,
    absentRequests: absentRequestReducer,
    grading: gradingReducer,

    // RTK Query APIs
    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [caseHistoryApi.reducerPath]: caseHistoryApi.reducer,
    [visualAcuityApi.reducerPath]: visualAcuityApi.reducer,
    [diagnosisApi.reducerPath]: diagnosisApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [absentRequestApi.reducerPath]: absentRequestApi.reducer,
    [gradingApi.reducerPath]: gradingApi.reducer,
    [consultationApi.reducerPath]: consultationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(Array.from(new Set(apiMiddlewares))), // ✅ prevent duplicate middlewares
});

// -----------------------------------------
// 🚀 PERSISTOR EXPORT
// -----------------------------------------
export const persistor = persistStore(store);
export default store;

// -----------------------------------------
// 💡 Optional: Hot Reload Safe Store (DEV)
// -----------------------------------------
if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept();
}
