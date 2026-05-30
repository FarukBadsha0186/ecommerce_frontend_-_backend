import axios from 'axios';

const api = axios.create({
   baseURL: '/api/v1/',
  timeout: 10000,
  withCredentials: true,  // ✅ এই লাইনটা যোগ করুন - cookies পাঠাবে
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚨 401 - Redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;