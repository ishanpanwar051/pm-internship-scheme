import { create } from 'zustand';
import api from '../api/client';
import { User, InternProfile, CompanyProfile } from '../types';

interface AuthState {
  user: User | null;
  profile: InternProfile | CompanyProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: { email: string; password: string; role?: string }) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
  updateProfile: (profile: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        set({
          user: res.data.user,
          profile: res.data.profile || null,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem('token');
        set({ user: null, profile: null, isInitialized: true, isLoading: false });
      }
    } catch {
      localStorage.removeItem('token');
      set({ user: null, profile: null, isInitialized: true, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      // 1. Authenticate credentials directly with backend API
      const res = await api.post('/auth/login', credentials);
      const user = res.data.user;
      const token = res.data.token;

      if (!user) {
        throw new Error('Authentication failed. No user record returned.');
      }

      if (token) {
        localStorage.setItem('token', token);
      }

      // 2. Fetch full associated profile
      const meRes = await api.get('/auth/me').catch(() => ({ data: { user, profile: null } }));
      const activeUser = meRes.data?.user || user;
      const activeProfile = meRes.data?.profile || res.data.profile || null;

      set({
        user: activeUser,
        profile: activeProfile,
        isLoading: false,
      });

      return activeUser;
    } catch (err: any) {
      // Clear all state on authentication failure
      localStorage.removeItem('token');
      localStorage.removeItem('pm_demo_user');
      localStorage.removeItem('pm_demo_profile');
      set({ user: null, profile: null, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      // Register with backend database
      const res = await api.post('/auth/register', data);
      const user = res.data.user;
      const token = res.data.token;

      if (!user) {
        throw new Error('Registration failed. No user record returned.');
      }

      if (token) {
        localStorage.setItem('token', token);
      }

      const meRes = await api.get('/auth/me').catch(() => ({ data: { user, profile: null } }));
      const activeUser = meRes.data?.user || user;
      const activeProfile = meRes.data?.profile || null;

      set({
        user: activeUser,
        profile: activeProfile,
        isLoading: false,
      });

      return activeUser;
    } catch (err: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('pm_demo_user');
      localStorage.removeItem('pm_demo_profile');
      set({ user: null, profile: null, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('pm_demo_user');
      localStorage.removeItem('pm_demo_profile');
      set({ user: null, profile: null });
    }
  },

  updateUser: (user) => {
    set({ user });
  },
  updateProfile: (profile) => {
    set({ profile });
  },
}));

export default useAuthStore;
