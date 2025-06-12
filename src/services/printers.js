import apiClient from '../api';

const ENDPOINTS = {
  BASE: '/printers',
  DETAIL: (id) => `/printers/${id}`,
};

export const Printers = {
  getAll: async (params = {}) => {
    console.log("Fetchhhhiiinng for ")
    const response = await apiClient.get(ENDPOINTS.BASE, { params });
    return response.data;
  },

  getById: async (id) => {
    if (!id) {
      return Promise.resolve({
        data: [],  // or {}
        success: true,
        message: "No ID provided, operation ignored"
      });
    }
    const response = await apiClient.get(ENDPOINTS.DETAIL(id));
    return response.data;
  },

  post: async (body) => {
    const response = await apiClient.post(ENDPOINTS.BASE, body);
    return response.data;
  },

  put: async (id, body) => {
    const response = await apiClient.put(ENDPOINTS.DETAIL(id), body);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
    return response.data;
  }
};