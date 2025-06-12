import { useState, useEffect } from 'react';

const useApiDropdown = (
  fetchFunction,
  valueKey = 'id',
  labelKey = 'name',
  showIdInLabel = false
)=> {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      // console.log("attempting to fetch")
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchFunction();
        // console.log("The response should have 50 items, ", response)

        // Get the nested data structure
        const data = response.data.data

        // console.log("getting data", data)

        // Transform the API response into options format
        const transformedOptions = data.map(item => ({
          value: item[valueKey],
          label: showIdInLabel ? `${item[valueKey]}: ${item[labelKey]}` : item[labelKey]
        }));

        setOptions(transformedOptions);
      } catch (err) {
        console.log(err)
        setError(err.message || 'Failed to load options');
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [fetchFunction, valueKey, labelKey]);

  return { options, isLoading, error };
};

export default useApiDropdown;