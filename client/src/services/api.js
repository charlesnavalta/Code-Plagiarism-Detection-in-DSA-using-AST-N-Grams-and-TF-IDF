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
    // If the backend returns 401 (Unauthorized), the session is dead or invalid
    if (error.response && error.response.status === 401) {
      console.warn(
        "Session expired or invalid token. Redirecting to terminal...",
      );

      // Wipe all session data immediately
      localStorage.clear();

      // Hard reset to the login page to purge React memory
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
