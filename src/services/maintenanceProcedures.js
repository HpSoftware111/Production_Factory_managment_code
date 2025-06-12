import apiClient from '../api';
import {flattenArrayField, flattenObject, normalizeParams} from "./utils";
import {maintenanceMaterialsService} from "./maintenanceMaterials";


const ENDPOINTS = {
  BASE: '/maintenanceProcedures',
  DETAIL: (id) => `/maintenanceProcedures/${id}`,
};

export const maintenanceProceduresService = {
  getAll: async (params = {}) => {
    const normalizedParams = normalizeParams(params)
    console.log('making a call, params are', normalizedParams)

    const response = await apiClient.get(ENDPOINTS.BASE, { params });
    const responseData = response.data.data;
    const flattenedData = responseData.data.map(item => flattenObject(item));

    const processedData = flattenedData.map(item => {
      return flattenArrayField(
        item,
        'Maintenance_Materials',
        'Maintenance_MaterialsID'
      );
    });


    const resolvedData = await Promise.all(
      processedData.map(async (item) => {
        const materialIds = item.Maintenance_Materials_ids || [];

        const names = [];
        for (const id of materialIds) {
          const resolvedMaterial = await maintenanceMaterialsService.getById(id);
          names.push(resolvedMaterial[`Inventory-Name`]);
        }

        return {
          ...item,
          Maintenance_Materials_names: names.join(', ')
        };
      })
    );

    // console.log("done done", resolvedData)


    const modifiedResponse = {
      ...response.data,
      data: {
        ...response.data.data,
        data: resolvedData
      }
    };
    return modifiedResponse;
  },

  getById: async (maintenanceProcedureID) => {
    if (!maintenanceProcedureID) {
      return Promise.resolve({
        data: [],  // or {}
        success: true,
        message: "No ID provided, operation ignored"
      });
    }

    const response = await apiClient.get(ENDPOINTS.DETAIL(maintenanceProcedureID));
    const responseData = response.data.data;
    const flattenedObject = flattenObject(responseData);

    // console.log('response', response)
    // console.log('responseData', responseData)
    // console.log('flattenedResponseData', flattenedObject)

    const modifiedResponse = {
      ...response,
      data: {
        ...response.data,
        data: flattenedObject
      }
    };

    return modifiedResponse;

  },

  post: async (params = {}) => {
    // console.log("requesting to post new data: ", params)
    const response = await apiClient.post(ENDPOINTS.BASE,  params );
    return response.data;
  },

  put: async (id, params = {}) => {
    const response = await apiClient.put(ENDPOINTS.DETAIL(id),  params );
    return response.data;
  },

  getByMaintenanceJobId: async (id, params = {}) => {

    if (!id) {
      console.log("done")
      return
    }

    const normalizedParams = normalizeParams({
      ...params,
      Maintenance_JobID: id
    })

    // console.log("params in get by job id", normalizedParams)

    const searchParams = {
      ...params,
      Maintenance_JobID: id
    };
    return maintenanceProceduresService.getAll(searchParams);  // Reference the service directly
  },

  delete: async(maintenanceProcedureID, params = {}) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(maintenanceProcedureID));
    return response.data;
  }
};