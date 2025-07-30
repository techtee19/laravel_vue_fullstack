import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(credentials) {
      try {
        const { data } = await api.login(credentials);
        this.setAuthData(data);
        return data;
      } catch (error) {
        throw error;
      }
    },

    async register(userData) {
      try {
        const { data } = await api.register(userData);
        this.setAuthData(data);
        return data;
      } catch (error) {
        throw error;
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.logout();
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.clearAuthData();
      }
    },

    setAuthData(data) {
      this.user = data.user;
      this.token = data.token;
      this.isAuthenticated = true;

      // Store token in localStorage and set API headers
      localStorage.setItem("token", data.token);
      api.setAuthToken(data.token);
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Remove from localStorage and API headers
      localStorage.removeItem("token");
      api.removeAuthToken();
    },

    initializeAuth() {
      const token = localStorage.getItem("token");
      console.log(
        "Initializing auth with token:",
        token ? "exists" : "not found"
      );

      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        api.setAuthToken(token);

        // Validate token by fetching current user
        this.fetchCurrentUser().catch(() => {
          // If token is invalid, clear auth data
          console.log("Token validation failed, clearing auth data");
          this.clearAuthData();
        });
      } else {
        this.clearAuthData();
      }
    },

    async fetchCurrentUser() {
      try {
        const { data } = await api.getCurrentUser();
        this.user = data;
        return data;
      } catch (error) {
        // If fetching user fails, clear auth data
        this.clearAuthData();
        throw error;
      }
    },
  },
});
