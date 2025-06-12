import apiClient from '../api';
import {flattenObject, normalizeParams} from "./utils";

const ENDPOINTS = {
  BASE: '/maintenanceMaterials',
  DETAIL: (id) => `/maintenanceMaterials/${id}`,
};

export const maintenanceMaterialsService = {
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
    console.log("maintenance service called", response.data)
    return modifiedResponse;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.DETAIL(id));
    const flattenedData = flattenObject(response.data.data);
    return flattenedData;
  },

  getByMaintenanceProcedureId: async (maintenanceProcedureID, params = {}) => {

    if (!maintenanceProcedureID) {
      console.log("done")
      return
    }

    const normalizedParams = normalizeParams({
      ...params,
      MaintenanceID: maintenanceProcedureID
    })

    // console.log("params in get by job id", normalizedParams)

    return maintenanceMaterialsService.getAll(normalizedParams);  // Reference the service directly
  },

  getByEquipmentId: async (equipmentId, params = {}) => {
    const searchParams = {
      ...params,
      MaintenanceID: equipmentId
    };
    return maintenanceMaterialsService.getAll(searchParams);  // Reference the service directly
  },

  delete: async(maintenanceMaterialsID, params = {}) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(maintenanceMaterialsID));
    return response.data;
  },

  post: async (params = {}) => {
    // console.log("requesting to post new data: ", params)
    const response = await apiClient.post(ENDPOINTS.BASE,  params );
    return response.data;
  },

  put: async (maintenanceMaterialsID, params = {}) => {
    // console.log("requesting to put new data: ", maintenanceJobID, " with the parameters ", params)
    const response = await apiClient.put(ENDPOINTS.DETAIL(maintenanceMaterialsID),  params );
    return response.data;
  },

};