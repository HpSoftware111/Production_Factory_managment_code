import apiClient from '../api';
import {flattenObject} from "./utils";

const ENDPOINTS = {
  BASE: '/maintenanceJobs',
  DETAIL: (id) => `/maintenanceJobs/${id}`,
};

export const maintenanceJobsService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.BASE, { params });

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

    console.log("This is the data that should be flat", flattenedObject)
    console.log(response)

    const modifiedResponse = {
      ...response.data,
      data: flattenedObject
    };

    return modifiedResponse;
  },

  post: async (params = {}) => {
    console.log("Attemping to post to maintenance jobs! with body,", params)
    const response = await apiClient.post(ENDPOINTS.BASE, params);
    console.log("The response issss!")
    return response.data;
  },

  put: async (cleaningJobID, params = {}) => {
    console.log("requesting to put new data: ", cleaningJobID, " with the parameters ", params)
    const response = await apiClient.put(ENDPOINTS.DETAIL(cleaningJobID),  params );
    return response.data;
  },

  delete: async(id) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(id));
    return response.data;
  }

};