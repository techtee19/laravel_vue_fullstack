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
      // TEMPORARY FIX: Clear everything on init to prevent redirect issues
      console.log("Clearing all auth data on init to prevent redirect issues");
      this.clearAuthData();

      // Comment out token validation for now
      // const token = localStorage.getItem("token");
      // if (token) {
      //   this.token = token;
      //   api.setAuthToken(token);
      //   this.fetchCurrentUser()...
      // }
    },

    async fetchCurrentUser() {
      try {
        const { data } = await api.getCurrentUser();
        this.user = data;
        return data;
      } catch (error) {
        // If fetching user fails, clear auth data
        console.log(
          "fetchCurrentUser failed, clearing auth data:",
          error.message
        );
        this.clearAuthData();
        throw error;
      }
    },

    // Debug method to check auth state
    debugAuthState() {
      console.log("Auth Store Debug:", {
        isAuthenticated: this.isAuthenticated,
        hasToken: !!this.token,
        hasUser: !!this.user,
        localStorageToken: !!localStorage.getItem("token"),
      });
    },

    // Force clear all auth data
    forceLogout() {
      console.log("Force logout - clearing all auth data");
      this.clearAuthData();
    },
  },
});
