import { createSlice } from "@reduxjs/toolkit";

const classifiedSlice = createSlice({
  name: "classifiedSlice",
  initialState: {
    rowData: {},
    isOpen: false,
    isClassified: false,
    isLoading: false,
  },
  reducers: {
    setRowData(state, action) {
      state.rowData = action.payload.rowData;
    },
    setOpen(state, action) {
      state.isOpen = action.payload.isOpen;
    },
    setClassification(state, action) {
      state.isClassified = action.payload.isClassified;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export default classifiedSlice.reducer;
export const classifiedActions = classifiedSlice.actions;
