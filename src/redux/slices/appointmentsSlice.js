import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleAppointments } from "../../services/client/api-handlers/appointments-handler";

// Async Thunk for fetching appointments
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await handleAppointments(); // Replace with your API call
      return response?.data?.today_appointments?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for appointments
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    selectedAppointment: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectAppointment, clearSelectedAppointment } =
  appointmentsSlice.actions;

export default appointmentsSlice.reducer;
