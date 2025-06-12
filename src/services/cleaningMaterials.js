import apiClient from '../api';
import {flattenObject, normalizeParams} from "./utils";

const ENDPOINTS = {
  BASE: '/cleaningMaterials',
  DETAIL: (id) => `/cleaningMaterials/${id}`,
};

export const cleaningMaterialsService = {
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
    // console.log("cleaning service called", response.data)
    return modifiedResponse;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.DETAIL(id));
    const flattenedData = flattenObject(response.data.data);
    return flattenedData;
  },

  getByCleaningProcedureId: async (cleaningProcedureID, params = {}) => {

    if (!cleaningProcedureID) {
      console.log("done")
      return
    }

    const normalizedParams = normalizeParams({
      ...params,
      CleaningID: cleaningProcedureID
    })

    // console.log("params in get by job id", normalizedParams)

    return cleaningMaterialsService.getAll(normalizedParams);  // Reference the service directly
  },

  getByEquipmentId: async (equipmentId, params = {}) => {
    const searchParams = {
      ...params,
      CleaningID: equipmentId
    };
    return cleaningMaterialsService.getAll(searchParams);  // Reference the service directly
  },

  delete: async(cleaningMaterialsID, params = {}) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(cleaningMaterialsID));
    return response.data;
  },

  post: async (params = {}) => {
    // console.log("requesting to post new data: ", params)
    const response = await apiClient.post(ENDPOINTS.BASE,  params );
    return response.data;
  },

  put: async (cleaningMaterialsID, params = {}) => {
    // console.log("requesting to put new data: ", cleaningJobID, " with the parameters ", params)
    const response = await apiClient.put(ENDPOINTS.DETAIL(cleaningMaterialsID),  params );
    return response.data;
  },

};