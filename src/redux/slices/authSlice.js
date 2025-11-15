import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// -----------------------------------------------------
// 🔹 Initial State
// -----------------------------------------------------
const initialState = {
  user: null,        // Full user object (id, name, roles, role_codes)
  loading: false,    // For async actions like login/logout
  error: null,       // Holds any error messages
};

// -----------------------------------------------------
// 🔹 Slice Definition
// -----------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set authenticated user (with roles and role_codes)
    setUser: (state, action) => {
      const { user } = action.payload || {};
      state.user = user || null;
      state.loading = false;
      state.error = null;
    },

    // ✅ Reset auth state (on logout or session expiry)
    resetAuth: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    // ✅ Manage loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ✅ Manage error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Optionally handle RTK Query lifecycle events here
  },
});

export const { setUser, resetAuth, setLoading, setError } = authSlice.actions;

// -----------------------------------------------------
// 🔹 Persist Config (localStorage persistence)
// -----------------------------------------------------
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Persist user (includes roles and role_codes)
};

// -----------------------------------------------------
// 🔹 Export Persisted Reducer
// -----------------------------------------------------
export default persistReducer(persistConfig, authSlice.reducer);
