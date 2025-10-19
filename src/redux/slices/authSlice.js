import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ------------------------------------
// ⚙️ Initial State
// ------------------------------------
const initialState = {
  user: null,              // Authenticated user's full data (id, name, role, permissions, etc.)
  isAuthenticated: false,  // Whether the session is valid
  loading: false,          // Network or authentication operation in progress
  error: null,             // Error message for login/logout/session issues
};

// ------------------------------------
// 🧩 Slice Definition
// ------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set authenticated user + session state
    setUser: (state, action) => {
      const payload = action.payload || {};
      state.user = payload.user || null;
      state.isAuthenticated = !!payload.isAuthenticated;
      state.loading = false;
      state.error = null;
    },

    // ✅ Reset state (used after logout or expired session)
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // ✅ Track loading status (for spinners)
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
    // Optional future RTK Query integration (e.g., login/logout)
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
  storage, // Uses localStorage by default
  whitelist: ["user", "isAuthenticated"], // Persist only these fields
};

// ------------------------------------
// 🚀 Export Persisted Reducer
// ------------------------------------
export default persistReducer(persistConfig, authSlice.reducer);
