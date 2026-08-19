import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const auth = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout")
};

export const quizzes = {
  published: () => api.get("/quizzes/published"),
  details: (id) => api.get(`/quizzes/${id}`),
  all: () => api.get("/quizzes"),
  create: (data) => api.post("/quizzes", data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  status: (id, status) =>
    api.patch(`/quizzes/${id}/status`, { status }),
  questions: (quizId) =>
    api.get(`/quizzes/${quizId}/questions`),
  addQuestion: (quizId, data) =>
    api.post(`/quizzes/${quizId}/questions`, data)
};

export const categories = {
  all: () => api.get("/categories"),
  create: (data) => api.post("/categories", data),
  update: (id, data) =>
    api.put(`/categories/${id}`, data),
  delete: (id) =>
    api.delete(`/categories/${id}`)
};

export const users = {
  all: () => api.get("/admin/users"),
  details: (id) => api.get(`/users/${id}`),
  update: (id, data) =>
    api.put(`/users/${id}`, data),
  status: (id, status) =>
    api.patch(`/admin/users/${id}/status`, { status }),
  delete: (id) =>
    api.delete(`/admin/users/${id}`)
};

export const attempts = {
  start: (quizId) =>
    api.post(`/quizzes/${quizId}/start`),
  get: (id) =>
    api.get(`/attempts/${id}`),
  questions: (id) =>
    api.get(`/attempts/${id}/questions`),
  answer: (id, data) =>
    api.post(`/attempts/${id}/answers`, data),
  submit: (id) =>
    api.post(`/attempts/${id}/submit`),
  result: (id) =>
    api.get(`/attempts/${id}/result`),
  detailedResult: (id) =>
    api.get(`/attempts/${id}/detailed-result`)
};

export const student = {
  dashboard: () =>
    api.get("/student/dashboard"),

  leaderboard: () =>
    api.get("/leaderboard")
};

export const admin = {
  stats: () =>
    api.get("/admin/dashboard/stats"),
  analytics: () =>
    api.get("/admin/analytics")
};

export default api;