// Notifications API
import { api } from './client';

export const notificationsApi = {
  // Get notifications
  async getNotifications(page = 1, limit = 20) {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread/count');
    return response.data || response;
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`, {});
    return response.data || response;
  },

  // Mark all as read
  async markAllAsRead() {
    const response = await api.put('/notifications/read-all', {});
    return response.data || response;
  },

  // Delete notification
  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data || response;
  },

  // Clear all notifications
  async clearAll() {
    const response = await api.delete('/notifications/clear-all');
    return response.data || response;
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data || response;
  },
};
