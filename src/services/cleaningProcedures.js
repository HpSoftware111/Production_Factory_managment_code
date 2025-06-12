import apiClient from '../api';
import {flattenArrayField, flattenObject, normalizeParams} from "./utils";
import {cleaningMaterialsService} from "./cleaningMaterials";


const ENDPOINTS = {
  BASE: '/cleaningProcedures',
  DETAIL: (id) => `/cleaningProcedures/${id}`,
};

export const cleaningProceduresService = {
  getAll: async (params = {}) => {
    const normalizedParams = normalizeParams(params)
    console.log('making a call, params are', normalizedParams)

    const response = await apiClient.get(ENDPOINTS.BASE, { params });
    const responseData = response.data.data;
    const flattenedData = responseData.data.map(item => flattenObject(item));

    const processedData = flattenedData.map(item => {
      return flattenArrayField(
        item,
        'Cleaning_Materials',
        'Cleaning_MaterialsID'
      );
    });

    // Debug log
    // console.log('Cleaning Materials IDs flattened:', processedData);
    // Process Data is an array with objects that look like this
    // CleaningID : 1
    // Cleaning_Job-Equipment-EquipmentID: 1
    // Cleaning_Materials_ids:[1, 6, 7, 8, 9] <- need to convert id's into names
    const resolvedData = await Promise.all(
      processedData.map(async (item) => {
        const materialIds = item.Cleaning_Materials_ids || [];

        const names = [];
        for (const id of materialIds) {
          const resolvedMaterial = await cleaningMaterialsService.getById(id);
          names.push(resolvedMaterial[`Inventory-Name`]);
        }

        return {
          ...item,
          Cleaning_Materials_names: names.join(', ')
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

  getById: async (cleaningProcedureID) => {
    if (!cleaningProcedureID) {
      return Promise.resolve({
        data: [],  // or {}
        success: true,
        message: "No ID provided, operation ignored"
      });
    }

    const response = await apiClient.get(ENDPOINTS.DETAIL(cleaningProcedureID));
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

  delete: async(cleaningProcedureID, params = {}) => {
    const response = await apiClient.delete(ENDPOINTS.DETAIL(cleaningProcedureID));
    return response.data;
  },

  getByCleaningJobId: async (id, params = {}) => {

    if (!id) {
      console.log("done")
      return
    }

    // const normalizedParams = normalizeParams({
    //   ...params,
    //   Cleaning_JobID: id
    // })

    console.log("params in get by job id", params)

    const searchParams = {
      ...params,
      Cleaning_JobID: id
    };
    return cleaningProceduresService.getAll(searchParams);  // Reference the service directly
  },
};