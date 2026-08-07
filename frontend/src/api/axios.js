import axios from 'axios';

// Use Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://habib-solvex.onrender.com/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    console.log('📤 Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;