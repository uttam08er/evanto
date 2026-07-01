import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, 
  // headers: { "Content-Type": "application/json" },
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
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put("/auth/change-password", data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

export const venueAPI = {
  getAll: (params) => api.get("/api/venues", { params }),
  getById: (id) => api.get(`/venues/${id}`),
  getFeatured: () => api.get("/api/venues/featured"),
  getMyVenues: () => api.get("/venues/owner/my-venues"),
  create: (formData) => api.post("/venues", formData, {
    headers: { "Content-Type": "multipart/form-data" }, 
  }),
  update: (id, formData) => api.put(`/venues/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  delete: (id) => api.delete(`/venues/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  confirmPayment: (id, data) => api.put(`/bookings/${id}/confirm-payment`, data),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  getOwnerBookings: () => api.get("/bookings/owner-bookings"),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

export const reviewAPI = {
  getByVenue: (venueId) => api.get(`/reviews/${venueId}`),
  add: (venueId, data) => api.post(`/reviews/${venueId}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  toggle: (venueId) => api.post(`/wishlist/${venueId}`),
};

export const notificationAPI = {
  get: () => api.get("/notifications"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (formData) => api.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

export const adminAPI = {
  getAnalytics: () => api.get("/admin/analytics"),
  getUsers: () => api.get("/admin/users"),
  toggleUserBlock: (id) => api.put(`/admin/users/${id}/toggle-block`),
  getVenues: (status) => api.get("/admin/venues", { params: { status } }),
  updateVenueStatus: (id, data) => api.put(`/admin/venues/${id}/status`, data),
  getBookings: () => api.get("/admin/bookings"),
};

export default api;
