import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof window !== 'undefined') {
    // In production builds deployed on Vercel/Render, if envUrl points to localhost but the page is served from another host, use relative proxy path '/api/v1'
    if (envUrl.includes('localhost') && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api/v1';
    }
    return envUrl;
  }
  return envUrl || '/api/v1';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request Interceptor: Inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aegis_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized & Parse Errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('aegis_token');
      localStorage.removeItem('aegis_user');
      if (window.location.pathname.startsWith('/app') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?expired=true';
      }
    }
    const message = 
      error.response?.data?.error?.message || 
      error.response?.data?.message || 
      error.message || 
      'An unexpected security engine error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
