import { createSlice } from "@reduxjs/toolkit";
import axios from "../../api";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    vendor: null,
  },
  reducers: {
    getVendorByID: (state, { payload }) => {
      const { id } = payload;

      axios
        .get(`/vendors/${id}`)
        .then((res) => {
          state.vendor = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updateVendorData: (state, { payload }) => {
      const { vendor } = payload;
      state.vendor = vendor;
    },
  },
});

export const { getVendorByID, updateVendorData } = vendorSlice.actions;
export const authReducer = vendorSlice.reducer;
