import { create } from 'zustand';
import api from '../api/client';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (role: string) => Promise<void>;
  markAsRead: (id: string, role: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (role: string) => {
    try {
      set({ isLoading: true });
      const endpoint = role === 'company' ? '/company/notifications' : '/intern/notifications';
      const res = await api.get(endpoint);
      set({
        notifications: res.data.notifications || [],
        unreadCount: res.data.unreadCount || 0,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string, role: string) => {
    try {
      const endpoint =
        role === 'company'
          ? `/company/notifications/${id}/read`
          : `/intern/notifications/${id}/read`;
      await api.put(endpoint);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (e) {
      // safe continue
    }
  },
}));
