// src/redux/slices/caseHistorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCaseHistoryHandler,
  createCaseHistoryHandler,
  updateCaseHistoryHandler,
} from "../../services/client/api-handlers/examinations-handler";

// Thunks for asynchronous actions
export const fetchCaseHistory = createAsyncThunk(
  "caseHistory/fetch",
  async (appointmentId, thunkAPI) => {
    try {
      const response = await fetchCaseHistoryHandler(appointmentId);
      return response || null; // Return the fetched data or null if not found
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const saveCaseHistory = createAsyncThunk(
  "caseHistory/save",
  async ({ appointmentId, data }, thunkAPI) => {
    try {
      if (data.id) {
        await updateCaseHistoryHandler(appointmentId, data);
        return { ...data, id: data.id };
      } else {
        const newData = await createCaseHistoryHandler(data);
        return newData;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice for CaseHistory state management
const caseHistorySlice = createSlice({
  name: "caseHistory",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCaseHistory: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCaseHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveCaseHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCaseHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(saveCaseHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCaseHistory } = caseHistorySlice.actions;
export default caseHistorySlice.reducer;
