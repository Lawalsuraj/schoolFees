import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Response interceptor — catches 401s and tries a silent refresh before giving up
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't attempt refresh logic for these two endpoints —
    // a 401 here just means "not logged in," not "token expired mid-session"
    const skipRefreshFor = ['/auth/me', '/auth/refresh', '/auth/login'];
    const shouldSkip = skipRefreshFor.some((url) => originalRequest.url.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkip) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api