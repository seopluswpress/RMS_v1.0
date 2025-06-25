import axios from 'axios';

const API_BASE_URL = 'https://hemanth525.pythonanywhere.com/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const dashboardService = {
  getRecentProperties: () => api.get('properties/'),
  getStats: () => api.get('properties/property_stats/'),
};

export const properties = {
  getProperties: () => api.get('properties/property_list/'),
  getUnits: () => api.get('properties/unit/'),
  gettenants: () => api.get('user/tenant/'),
  getleases: () => api.get('properties/lease/'), // Added trailing slash
  getLease: (id) => api.get(`properties/lease/${id}/`), // Get single lease by ID
  postunit: (data) => api.post('properties/unit/', data),

  // Invoice endpoints
  getinvoices: () => api.get('properties/property/invoice/'),
  getinvoice: (id) => api.get(`properties/property/invoice/${id}/`),
  postinvoice: (data) => api.post('properties/property/invoice/', data),
  updateinvoice: (id, data) => api.patch(`properties/property/invoice/${id}/`, data),

  // Maintenance endpoints
  getmaintainence: () => api.get('properties/maintainence/'),
  createmaintainence: (data) => api.post('properties/maintainence/', data),
  updatemaintainence: (id, data) => api.patch(`properties/maintainence/${id}/`, data),
  deletemaintainence: (id) => api.delete(`properties/maintainence/${id}/`),
  // Property and lease management
  deleteproperty: (id) => api.post(`properties/deactivate/${id}/`),
  deletelease: (id) => api.post(`properties/delete_lease/${id}/`), // Confirm POST is correct; consider DELETE if backend supports
  createlease: (data) => api.post('properties/lease/', data),
  updatelease: (id, data) => api.patch(`properties/lease/${id}/`, data),
  inactivelease: (id) => api.patch(`properties/lease/inactive/${id}/`),
  getinactivelease: () => api.get('properties/lease/inactive/'),
  
  // Property update
  updateproperty: (id, data) => api.patch(`properties/property/${id}/`, data),

  //payment endpoints
  payment: (data) => api.post('accounts/payment/', data),
  overdueinvoices: (data) => api.post('accounts/overdue-invoices/', data),
};

export const authService = {
  login: (credentials) => api.post('auth/login/', credentials),
  logout: () => api.post('auth/logout/'),
  getCurrentUser: () => api.get('auth/user/'),
};

export default api;