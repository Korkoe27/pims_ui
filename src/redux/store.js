import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentsSlice";
import authReducer from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import caseHistoryReducer from "./slices/caseHistorySlice";

// Persist Config
const persistConfig = {
  key: "auth", // Key for auth slice
  storage,     // Use local storage
};

// Create a persisted reducer for auth
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Configure store
export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,  // Normal appointments reducer
    auth: persistedAuthReducer,         // Persisted auth reducer
    caseHistory: caseHistoryReducer,
  },
});

// Create a persistor
export const persistor = persistStore(store);
