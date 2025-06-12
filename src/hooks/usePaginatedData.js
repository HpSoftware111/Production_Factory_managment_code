import {useState, useEffect, useCallback} from 'react';
import {debounce} from "@mui/material";

const usePaginatedData = (fetchFunction, initialParams = {}) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (params) => {
    // console.log("fetch data hook params:", params)
    setLoading(true);
    try {
      const response = await fetchFunction(params);

      // This check added to gracefully handle early exits from service layer
      // if (response.success && !response.data) {
      //   setData([]);
      //   setTotalItems(0);
      //   setTotalPages(0);
      //   setLoading(false);
      //   return;
      // }

      // Service layer did not exit early, therefore we attempt to access data
      const responseData = response.data;
      setData(responseData.data);
      setTotalItems(responseData.totalItems);
      setTotalPages(responseData.totalPages);
      setCurrentPage(responseData.currentPage);
      return responseData;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(initialParams);
  }, []);

  const testSearch = () => {
    fetchData({ ...initialParams, keyword: "test", page: 1 });
  };

  const changePage = (newPage) => {
    fetchData({ ...initialParams, page: newPage });
  };

  const handleSearch = useCallback(

    debounce((searchTerm) => {
      fetchData({ ...initialParams, keyword: searchTerm, page: 1 });
      console.log("handling search", searchTerm)
    }, 300),
    [initialParams]
  );

  return {
    data,
    loading,
    error,
    totalItems,
    currentPage,
    totalPages,
    changePage,
    handleSearch,
    testSearch
  };
};

export default usePaginatedData;
