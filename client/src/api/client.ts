import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;

  // When running on GitHub Pages or external tunnels, connect to the live Cloudflare tunnel API
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('github.io') || window.location.hostname.includes('trycloudflare.com'))
  ) {
    return 'https://vanilla-metal-adapters-task.trycloudflare.com/api/v1';
  }

  // Local development / proxy
  return '/api/v1';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: return real data, never mock or fabricate data. Clean, human error messages.
api.interceptors.response.use(
  (response) => {
    // If backend returned HTML (e.g. index.html SPA fallback), reject as server unavailable
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))
    ) {
      const err = new Error('Service is currently unavailable. Please try again later.') as any;
      err.status = 503;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    // Clean, friendly error message without stack trace or technical jargon
    let message = 'Unable to complete request. Please try again.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.status === 401) {
      message = 'Invalid email or password.';
    } else if (error.response?.status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (error.response?.status === 404) {
      message = 'The requested information was not found.';
    } else if (error.response?.status === 409) {
      message = error.response.data?.message || 'A conflict occurred. Please refresh and try again.';
    } else if (error.response?.status >= 500) {
      message = 'Server encountered an issue. Please try again shortly.';
    } else if (error.message && !error.response) {
      message = 'Network connection issue. Please check your internet connection.';
    }

    const err = new Error(message) as any;
    err.response = error.response;
    err.status = error.response?.status;
    return Promise.reject(err);
  }
);

export default api;
