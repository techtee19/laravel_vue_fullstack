import axios from "axios";
import { getTransitionRawChildren } from "vue";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Clear auth store if available
      if (typeof window !== "undefined" && window.authStore) {
        window.authStore.clearAuthData();
      }
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default {
  getTrainees(params = {}) {
    return apiClient.get("/trainees", { params });
  },
  getTraineeById(id) {
    return apiClient.get(`/trainees/${id}`);
  },
  createTrainee(data) {
    return apiClient.post("/trainees", data);
  },
  updateTrainee(id, data) {
    return apiClient.put(`/trainees/${id}`, data);
  },
  deleteTrainee(id) {
    return apiClient.delete(`/trainees/${id}`);
  },
  getTrainingCenters() {
    return apiClient.get("/training-centers");
  },
  register(data) {
    return apiClient.post("/register", data);
  },
  login(data) {
    return apiClient.post("/login", data);
  },
  logout() {
    return apiClient.post("/logout");
  },
  setAuthToken(token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  },
  removeAuthToken() {
    delete apiClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  },
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
  getCurrentUser() {
    return apiClient.get("/user");
  },
};

// GET /trainees calls the index method.
// GET /trainees/{id} calls the show method.
// POST /trainees calls the store method.
// PUT /trainees/{id} calls the update method.
// DELETE /trainees/{id} calls the destroy method.
