import { create } from 'zustand';
import api from '../api/axios.js';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true, // true while we check if a session already exists (on app load)
  isAuthenticated: false,

  // Called once when the app first loads
  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    set({ user: res.data.data.user, isAuthenticated: true });
  },

  register: async (name, email, password, className) => {
    const res = await api.post('/auth/register', { name, email, password, className });
    set({ user: res.data.data.user, isAuthenticated: true });
  },

    logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
 },
 
}));

export default useAuthStore;