import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://ecommerce-8lhe.onrender.com/api/v1/',
  baseURL: 'https://ecommerce-8lhe.onrender.com/api/v1/',
  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token added: ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isGuest = localStorage.getItem('isGuest') === 'true';
      if (!isGuest) {  // ✅ Guest হলে redirect করবে না
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;