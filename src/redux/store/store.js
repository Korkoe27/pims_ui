import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// API slices
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


// State slices
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

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

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

export const store = configureStore({
  reducer: {
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

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(uniqueApiMiddlewares),
});

export const persistor = persistStore(store);

export default store;
