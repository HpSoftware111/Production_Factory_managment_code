import apiClient from '../api';
import {flattenObject, normalizeParams} from "./utils";

const ENDPOINTS = {
  BASE: '/cleaningJobs',
  DETAIL: (id) => `/cleaningJobs/${id}`,
  BY_EQUIPMENT: (equipmentId) => `/cleaning-jobs/equipment/${equipmentId}`,
};

export const cleaningJobsService = {
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

    const modifiedResponse = {
      ...response.data,
      data: flattenedObject
    };

    return modifiedResponse;
  },

  getByEquipmentId: async (id, params = {}) => {
    if (!id) {
      return []
    }
    const searchParams = {
      ...params,
      EquipmentID: id
    };
    return cleaningJobsService.getAll(searchParams);  // Reference the service directly
  },

  post: async (params = {}) => {
    // console.log("requesting to post new data: ", params)
    const response = await apiClient.post(ENDPOINTS.BASE,  params );
    return response.data;
  },

  put: async (cleaningJobID, params = {}) => {
    console.log("requesting to put new data: ", cleaningJobID, " with the parameters ", params)
    const response = await apiClient.put(ENDPOINTS.DETAIL(cleaningJobID),  params );
    return response.data;
  },

  delete: async(cleaningJobID) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(cleaningJobID));
    return response.data;
  }

};