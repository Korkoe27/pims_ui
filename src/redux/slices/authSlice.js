// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ------------------------------------
// ⚙️ Initial State
// ------------------------------------
const initialState = {
  user: null,          // Logged-in user's full data (includes role, permissions, access)
  loading: false,      // Authentication/network operation in progress
  error: null,         // Error message (login, logout, session failure, etc.)
};

// ------------------------------------
// 🧩 Slice Definition
// ------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set authenticated user data
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    // ✅ Reset state (e.g., after logout)
    resetAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    // ✅ Track loading status (useful for spinners)
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ✅ Capture authentication-related errors
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Optional: integrate directly with RTK Query or async thunks here
  },
});

// ------------------------------------
// 🧾 Exports
// ------------------------------------
export const { setUser, resetAuth, setLoading, setError } = authSlice.actions;

// ------------------------------------
// 💾 Persistent Config
// ------------------------------------
const persistConfig = {
  key: "auth",
  storage, // defaults to localStorage in web
  whitelist: ["user"], // persist only the user data (not loading/error)
};

// ------------------------------------
// 🚀 Export Persisted Reducer
// ------------------------------------
export default persistReducer(persistConfig, authSlice.reducer);
