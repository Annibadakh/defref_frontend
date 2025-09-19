import axios from 'axios';

const API_BASE_URL = 'https://defref-assignment.vercel.app';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) =>
    api.post('/auth/register', data),

  login: (data) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/profile', data),

  updatePassword: (data) =>
    api.put('/auth/updatepassword', data),
};

// PDF API
export const pdfAPI = {
  upload: (formData) =>
    api.post('/pdfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  getAll: (params) => api.get('/pdfs', { params }),

  getPublic: (params) => api.get('/pdfs/public', { params }),

  getById: (id) => api.get(`/pdfs/${id}`),

  getFile: (id) =>
    api.get(`/pdfs/${id}/file`, {
      responseType: 'blob',
    }),

  update: (id, data) => api.put(`/pdfs/${id}`, data),

  delete: (id) => api.delete(`/pdfs/${id}`),
};

// Annotation API
export const annotationAPI = {
  create: (data) => api.post('/annotations', data),

  getByPDF: (pdfId, params) =>
    api.get(`/annotations/pdf/${pdfId}`, { params }),

  getMy: (params) => api.get('/annotations/my', { params }),

  update: (id, data) => api.put(`/annotations/${id}`, data),

  delete: (id) => api.delete(`/annotations/${id}`),

  addReply: (id, data) =>
    api.post(`/annotations/${id}/replies`, data),

  deleteReply: (id, replyId) =>
    api.delete(`/annotations/${id}/replies/${replyId}`),
};

export default api;
