// store.js
import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentsSlice";
import authReducer from "./slices/authSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

// Persist Config
const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    auth: authReducer,
    auth: persistedAuthReducer,
  },
});



export const persistor = persistStore(store);
