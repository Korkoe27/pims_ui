import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// --- API slices ---
import { authApi } from "../api/features/authApi";
import { patientApi } from "../api/features/patientApi";
import { caseHistoryApi } from "../api/features/caseHistoryApi";
import { visualAcuityApi } from "../api/features/visualAcuityApi";
import { diagnosisApi } from "../api/features/diagnosisApi";
import { managementApi } from "../api/features/managementApi";
import { dashboardApi } from "../api/features/dashboardApi";
import { appointmentsApi } from "../api/features/appointmentsApi";
import { absentRequestApi } from "../api/features/absentRequestApi";
import { gradingApi } from "../api/features/gradingApi";
import { consultationsApi } from "../api/features/consultationsApi";
import { reportsApi } from "../api/features/reportsApi";

// --- State slices ---
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

/* ------------------------------------------------------------------
   🔹 PERSIST CONFIG
   Only persist auth.user — avoid caching large slices or locks
------------------------------------------------------------------- */
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Only user info, not access tokens
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

/* ------------------------------------------------------------------
   🔹 Root Reducer
   Enables full store reset on logout (RESET_APP_STATE)
------------------------------------------------------------------- */
const appReducer = combineReducers({
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

  // ✅ RTK Query reducers
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
  [consultationsApi.reducerPath]: consultationsApi.reducer,
  [reportsApi.reducerPath]: reportsApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP_STATE") {
    // 🧹 Completely clear Redux state on logout
    storage.removeItem("persist:root");
    state = undefined;
  }
  return appReducer(state, action);
};

/* ------------------------------------------------------------------
   🔹 Middlewares
------------------------------------------------------------------- */
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
  consultationsApi.middleware,
  reportsApi.middleware,
];
const uniqueApiMiddlewares = Array.from(new Set(apiMiddlewares));

/* ------------------------------------------------------------------
   🔹 Store & Persistor
------------------------------------------------------------------- */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(uniqueApiMiddlewares),
});

export const persistor = persistStore(store);
export default store;
