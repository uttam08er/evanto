import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    return Promise.reject(error); 
  }
);

export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  logout: () => api.post("/api/auth/logout"),
  getMe: () => api.get("/api/auth/me"),
  forgotPassword: (email) => api.post("/api/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.put(`/api/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put("/api/auth/change-password", data),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
};

export const venueAPI = {
  getAll: (params) => api.get("/api/venues", { params }),
  getById: (id) => api.get(`/api/venues/${id}`),
  getFeatured: () => api.get("/api/venues/featured"),
  getMyVenues: () => api.get("/api/venues/owner/my-venues"),
  create: (formData) => api.post("/api/venues", formData, {
    headers: { "Content-Type": "multipart/form-data" }, 
  }),
  update: (id, formData) => api.put(`/api/venues/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  delete: (id) => api.delete(`/api/venues/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post("/api/bookings", data),
  confirmPayment: (id, data) => api.put(`/api/bookings/${id}/confirm-payment`, data),
  getMyBookings: () => api.get("/api/bookings/my-bookings"),
  getOwnerBookings: () => api.get("/api/bookings/owner-bookings"),
  getById: (id) => api.get(`/api/bookings/${id}`),
  cancel: (id, reason) => api.put(`/api/bookings/${id}/cancel`, { reason }),
};

export const reviewAPI = {
  getByVenue: (venueId) => api.get(`/api/reviews/${venueId}`),
  add: (venueId, data) => api.post(`/api/reviews/${venueId}`, data),
  update: (id, data) => api.put(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

export const wishlistAPI = {
  get: () => api.get("/api/wishlist"),
  toggle: (venueId) => api.post(`/api/wishlist/${venueId}`),
};

export const notificationAPI = {
  get: () => api.get("/api/notifications"),
  markRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllRead: () => api.put("/api/notifications/read-all"),
};

export const userAPI = {
  getProfile: () => api.get("/api/users/profile"),
  updateProfile: (formData) => api.put("/api/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

export const adminAPI = {
  getAnalytics: () => api.get("/api/admin/analytics"),
  getUsers: () => api.get("/api/admin/users"),
  toggleUserBlock: (id) => api.put(`/api/admin/users/${id}/toggle-block`),
  getVenues: (status) => api.get("/api/admin/venues", { params: { status } }),
  updateVenueStatus: (id, data) => api.put(`/api/admin/venues/${id}/status`, data),
  getBookings: () => api.get("/api/admin/bookings"),
};

export default api;
