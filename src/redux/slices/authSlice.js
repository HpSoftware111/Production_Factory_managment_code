import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "../../api";
import {
  setToken,
  setRefreshToken,
  getToken,
  removeToken,
  removeRefreshToken,
  getRefreshToken,
} from "../../utils/authUtils";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      // return error.response.data;
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async ({ token }, thunkAPI) => {
    try {
      const response = await axios.post("/auth/refresh", { token });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getToken() ? jwtDecode(getToken()) : null,
    token: getToken(),
    refreshToken: getRefreshToken(),
    isAuthenticated: !!getToken(),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      removeToken();
      removeRefreshToken();
      window.location.href = "/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.token = payload.data.token;
        state.refreshToken = payload.data.refreshToken;
        state.user = jwtDecode(state.token);
        state.isAuthenticated = true;
        state.error = null;
        setToken(state.token);
        setRefreshToken(state.refreshToken);
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload.errorMessage;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
