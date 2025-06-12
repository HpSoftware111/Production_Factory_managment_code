export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const setRefreshToken = (token) => {
  return localStorage.setItem("refreshToken", token);
};

export const removeRefreshToken = () => {
  return localStorage.removeItem("refreshToken");
};