import apiClient from "./api";

export const flattenObject = (obj, prefix = '') => {
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

export const flattenArrayField = (data, arrayField, fieldToExtract) => {
  if (!data[arrayField] || !Array.isArray(data[arrayField])) {
    return data;
  }

  return {
    ...data,
    [`${arrayField}_ids`]: data[arrayField].map(item => item[fieldToExtract]),
  };
};

export const resolveArrayField = async (data, fieldName, apiEndpoint, displayField) => {
  const ids = data[`${fieldName}_ids`];
  if (!ids || ids.length === 0) return data;

  try {
    const resolvedItems = await Promise.all(
      ids.map(id => apiClient.get(`${apiEndpoint}/${id}`))
    );

    return {
      ...data,
      [`${fieldName}_resolved`]: resolvedItems.map(response => response.data[displayField])
    };
  } catch (error) {
    console.error('Error resolving array field:', error);
    return data;
  }
};


export const normalizeParams = (params = {}) => {
  return {
    page: params.page || 1,           // default page
    perPage: params.perPage || 10,    // default items per page
    search: params.search || '',      // default search term
    ...params                         // keep any other params passed
  };
};