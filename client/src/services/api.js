import axios from 'axios';

//const API_URL = 'http://localhost:5000/api/v1';
// = 'https://https://client-panel.onrender.com/api/v1';
//const API_URL ='https://client-panel.onrender.com/api/v1';
const API_URL = 'https://ecommerce-8lhe.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH =============
export const adminLogin = (data) => api.post('/admin-login', data);
export const userLogin = (data) => api.post('/user-login', data);
export const userRegister = (data) => api.post('/user-register', data);
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ============= PRODUCTS =============
export const getProducts = () => api.get('/user/all_product');
export const getProductById = (id) => api.get(`/public/product/${id}`);

// ============= CART =============
export const getCart = () => api.get('/cart/Read');
export const addToCart = (data) => api.post('/cart/Create', data);
export const updateCartItem = (product_id, quantity) => api.put(`/cart/update/${product_id}`, { quantity });
export const removeCartItem = (product_id) => api.delete(`/cart/delete/${product_id}`);
export const clearCart = () => api.delete('/cart/clear-all');

// ============= ORDERS (User) =============
export const getMyOrders = () => api.get('/user/my-orders');
export const getMyOrderById = (orderId) => api.get(`/user/my-orders/${orderId}`);
export const cancelUserOrder = (orderId) => api.put(`/user/orders/${orderId}/cancel`);
export const trackUserOrder = (orderId) => api.get(`/user/orders/${orderId}/track`);
// ============= ADMIN =============
export const adminVerify = () => api.get('/adminVerify');

export default api;