import axios from 'axios';

// Get token from storage (supports admin sessionStorage)
export const getConfig = () => {
  const lsToken = localStorage.getItem('token');
  const ssToken = sessionStorage.getItem('token');
  const token = lsToken || ssToken || '';
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Axios default configuration
export const setupAxios = () => {
  // Default to production API unless explicitly overridden
  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5003';
  axios.defaults.baseURL = base;
  
  // Add a request interceptor to include auth token (localStorage or sessionStorage)
  axios.interceptors.request.use(
    (config) => {
      const lsToken = localStorage.getItem('token');
      const ssToken = sessionStorage.getItem('token');
      const token = lsToken || ssToken;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};
