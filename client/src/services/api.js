// src/services/api.js
import axios from "axios";

// Create a centralized axios instance with a DYNAMIC hostname
const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
});

// 1. REQUEST INTERCEPTOR: Automatically attach the token to every outgoing call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. RESPONSE INTERCEPTOR: Global "Session Expired" listener
api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/forgot-password");
    const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname === "/forgot-password";

    // Only redirect to /login on 401 if it's an authenticated API call with an expired token, NOT a failed login attempt
    if (error.response && error.response.status === 401 && !isAuthEndpoint && !isAuthPage) {
      console.warn(
        "Session expired or invalid token. Redirecting to login...",
      );

      // Wipe all session data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Hard reset to the login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
