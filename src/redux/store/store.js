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

// State slices
import authReducer from "../slices/authSlice";
import dashboardReducer from "../slices/dashboardSlice";
import patientReducer from "../slices/patientSlice";
import appointmentsReducer from "../slices/appointmentsSlice";
import caseHistoryReducer from "../slices/consultationSlice";
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
    absentRequests: absentRequestReducer,

    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [caseHistoryApi.reducerPath]: caseHistoryApi.reducer,
    [visualAcuityApi.reducerPath]: visualAcuityApi.reducer,
    [diagnosisApi.reducerPath]: diagnosisApi.reducer,
    [managementApi.reducerPath]: managementApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
    [absentRequestApi.reducerPath]: absentRequestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(patientApi.middleware)
      .concat(caseHistoryApi.middleware)
      .concat(visualAcuityApi.middleware)
      .concat(diagnosisApi.middleware)
      .concat(managementApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(appointmentsApi.middleware)
      .concat(absentRequestApi.middleware),
});

export const persistor = persistStore(store);

export default store;
