import axios from "axios";
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setToken,
} from "../utils/authUtils";
// import store from "../redux/store";
// import { logout } from "../redux/slices/authSlice";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // baseURL: 'http://localhost:5000/api/',
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["authorization"];
    if (newToken) {
      setToken(newToken.split(" ")[1]);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await instance.post("/auth/refresh-token", {
            refreshToken,
          });
          setToken(data.token);
          originalRequest.headers["Authorization"] = `Bearer ${data.token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          removeToken();
          removeRefreshToken();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        removeToken();
        removeRefreshToken();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
