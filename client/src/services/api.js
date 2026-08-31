// src/services/api.js
import axios from "axios";

// Helper to determine the API base URL:
// 1. If REACT_APP_API_URL is provided (e.g. on Vercel or in .env), use it
// 2. Otherwise, fall back to localhost / dynamic hostname for local development
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    let url = process.env.REACT_APP_API_URL.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    if (!url.endsWith('/api')) {
      url = `${url}/api`;
    }
    return url;
  }
  return `http://${window.location.hostname}:5000/api`;
};

// Create a centralized axios instance
const api = axios.create({
  baseURL: getBaseURL(),
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

// Helper to silently ping backend to wake it up from cold sleep (e.g., Render free tier)
export const warmUpServer = () => {
  try {
    const rawBase = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;
    const serverRoot = rawBase.replace(/\/api\/?$/, '');
    
    // 1. Silent fetch to root endpoint
    fetch(`${serverRoot}/`, { method: 'GET', mode: 'no-cors' }).catch(() => {});
    
    // 2. Health check via axios instance
    api.get('/health', { timeout: 30000 }).catch(() => {});
  } catch (e) {
    // Ignore warmup errors
  }
};

export default api;
