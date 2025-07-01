import { createSlice } from "@reduxjs/toolkit";

const absentRequestSlice = createSlice({
  name: "absentRequests",
  initialState: {
    selectedRequest: null,
  },
  reducers: {
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
});

export const { setSelectedRequest, clearSelectedRequest } = absentRequestSlice.actions;

export default absentRequestSlice.reducer;
