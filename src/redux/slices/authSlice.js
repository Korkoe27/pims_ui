import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// -----------------------------------------------------
// 🔹 Initial State
// -----------------------------------------------------
const initialState = {
  user: null,        // Full user object (id, name, role, etc.)
  access: null,      // Access permissions from backend
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
    // ✅ Set authenticated user and access data
    setUser: (state, action) => {
      const { user, access } = action.payload || {};
      state.user = user || null;
      state.access = access || null;
      state.loading = false;
      state.error = null;
    },

    // ✅ Reset auth state (on logout or session expiry)
    resetAuth: (state) => {
      state.user = null;
      state.access = null;
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
  whitelist: ["user", "access"], // Persist both user + access
};

// -----------------------------------------------------
// 🔹 Export Persisted Reducer
// -----------------------------------------------------
export default persistReducer(persistConfig, authSlice.reducer);
