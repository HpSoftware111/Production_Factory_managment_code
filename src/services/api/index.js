import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://your-api-base-url',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;