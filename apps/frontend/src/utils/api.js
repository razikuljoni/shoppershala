import axios from 'axios';

// In Docker: Nginx proxies /api/* to backend, so use relative URL
// In development: falls back to localhost:3000
const BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Map meta to pagination for backward compatibility
    if (response.data && response.data.meta && !response.data.pagination) {
      response.data.pagination = response.data.meta;
    }
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  },
);

async function request(endpoint, options = {}) {
  const { method = 'GET', body, headers, ...rest } = options;
  const config = {
    method,
    url: endpoint,
    headers,
    ...rest,
  };
  if (body) {
    try {
      config.data = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      config.data = body;
    }
  }
  return axiosInstance(config);
}

export const api = {
  // Authentication
  auth: {
    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    whoami: () => request('/auth/whoami'),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // Products
  products: {
    getAll: (page = 1, limit = 10, categoryId = '') => {
      let url = `/products?page=${page}&limit=${limit}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      return request(url);
    },
    getById: (id) => request(`/products/${id}`),
    create: (productData) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    update: (id, productData) =>
      request(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData),
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // Categories
  categories: {
    getAll: (page = 1, limit = 100) => request(`/categories?page=${page}&limit=${limit}`),
    getById: (id) => request(`/categories/${id}`),
    create: (categoryData) =>
      request('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      }),
    update: (id, categoryData) =>
      request(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(categoryData),
      }),
    delete: (id) =>
      request(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // Orders
  orders: {
    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
    getAll: (page = 1, limit = 10, status = '') => {
      let url = `/orders?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      return request(url);
    },
    getMyOrders: (page = 1, limit = 10) => request(`/orders/my?page=${page}&limit=${limit}`),
    getById: (id) => request(`/orders/${id}`),
    update: (id, updateData) =>
      request(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    delete: (id) =>
      request(`/orders/${id}`, {
        method: 'DELETE',
      }),
  },

  // Reviews
  reviews: {
    create: (productId, rating, comment) =>
      request('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId, rating, comment }),
      }),
    getAll: (page = 1, limit = 10) => request(`/reviews?page=${page}&limit=${limit}`),
    getByProduct: (productId) => request(`/reviews/product/${productId}`),
    getMyReviews: () => request('/reviews/my'),
    update: (id, updateData) =>
      request(`/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      }),
    delete: (id) =>
      request(`/reviews/${id}`, {
        method: 'DELETE',
      }),
  },

  // Wishlist
  wishlist: {
    get: () => request('/wishlist'),
    add: (productId) =>
      request('/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }),
    remove: (productId) =>
      request(`/wishlist/remove/${productId}`, {
        method: 'DELETE',
      }),
    check: (productId) => request(`/wishlist/check/${productId}`),
    clear: () =>
      request('/wishlist/clear', {
        method: 'DELETE',
      }),
  },

  // Users Management
  users: {
    getAll: (page = 1, limit = 10) => request(`/users?page=${page}&limit=${limit}`),
    getById: (id) => request(`/users/${id}`),
    create: (userData) =>
      request('/users/create', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: (id, userData) =>
      request(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
      }),
    delete: (id) =>
      request(`/users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Shops
  shops: {
    create: (shopData) =>
      request('/shops', {
        method: 'POST',
        body: JSON.stringify(shopData),
      }),
    getMyShop: () => request('/shops/my'),
    getById: (id) => request(`/shops/${id}`),
    getAll: (page = 1, limit = 10) => request(`/shops?page=${page}&limit=${limit}`),
    update: (id, shopData) =>
      request(`/shops/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(shopData),
      }),
    delete: (id) =>
      request(`/shops/${id}`, {
        method: 'DELETE',
      }),
  },

  // Banners
  banners: {
    getActive: () => request('/banners/active'),
    getAll: (page = 1, limit = 10) => request(`/banners?page=${page}&limit=${limit}`),
    getById: (id) => request(`/banners/${id}`),
    create: (bannerData) =>
      request('/banners', {
        method: 'POST',
        body: JSON.stringify(bannerData),
      }),
    update: (id, bannerData) =>
      request(`/banners/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(bannerData),
      }),
    delete: (id) =>
      request(`/banners/${id}`, {
        method: 'DELETE',
      }),
  },

  // Analytics
  analytics: {
    getDashboard: () => request('/analytics/dashboard'),
    getSales: (startDate = '', endDate = '') => {
      let url = '/analytics/sales';
      if (startDate || endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return request(url);
    },
    getTopProducts: (limit = 10) => request(`/analytics/top-products?limit=${limit}`),
    getCategorySales: () => request('/analytics/category-sales'),
    getUserStats: (userId = '') => {
      let url = '/analytics/user-stats';
      if (userId) url += `/${userId}`;
      return request(url);
    },
    getOrderStatus: () => request('/analytics/order-status'),
    getMonthlyTrend: (year = new Date().getFullYear()) =>
      request(`/analytics/monthly-trend?year=${year}`),
  },
};
