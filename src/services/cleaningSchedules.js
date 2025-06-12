import apiClient from '../api';

const ENDPOINTS = {
  BASE: '/cleaningSchedules',
  DETAIL: (id) => `/cleaningSchedules/${id}`,
};

const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '-' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const flattenData = (data) => {
  return data.map(item => flattenObject(item));
};

export const cleaningSchedulesService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.BASE, { params });
    const responseData = response.data.data;
    const flattenedData = flattenData(responseData.data);

    const modifiedResponse = {
      ...response.data,
      data: {
        ...response.data.data,
        data: flattenedData
      }
    };


    console.log(response.data)
    console.log(modifiedResponse)

    return modifiedResponse;
  },
};