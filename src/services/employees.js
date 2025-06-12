import apiClient from '../api';
import {flattenObject, normalizeParams} from "./utils";

const ENDPOINTS = {
  BASE: '/employees',
  DETAIL: (id) => `/employees/${id}`,
};

export const employeesService = {
  getAll: async (params = {}) => {
    const allItemsParams = { ...params, all: true };
    const response = await apiClient.get(ENDPOINTS.BASE, { params: allItemsParams });

    const responseData = response.data.data;
    const flattenedData = responseData.data.map(item => flattenObject(item));

    const modifiedResponse = {
      ...response.data,
      data: {
        ...response.data.data,
        data: flattenedData
      }
    };

    return modifiedResponse;
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
    const responseData = response.data.data;
    const flattenedObject = flattenObject(responseData);

    const modifiedResponse = {
      ...response.data,
      data: flattenedObject
    };

    return modifiedResponse;
  },

  post: async (params = {}) => {
    // console.log("requesting to post new data: ", params)
    const response = await apiClient.post(ENDPOINTS.BASE,  params );
    return response.data;
  },

  put: async (cleaningJobID, params = {}) => {
    const response = await apiClient.put(ENDPOINTS.DETAIL(cleaningJobID),  params );
    return response.data;
  },

  delete: async(cleaningJobID) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(cleaningJobID));
    return response.data;
  }

};