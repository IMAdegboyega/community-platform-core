/**
 * Notifications API Service
 * Handles notifications, push tokens, and preferences
 */

import api from './client';

export const notificationsApi = {
  // Get notifications
  async getNotifications(limit = 20, offset = 0) {
    const response = await api.get(`/notifications?limit=${limit}&offset=${offset}`);
    return {
      notifications: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    return response.data.unread_count;
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    await api.post(`/notifications/${notificationId}/read`, {});
  },

  // Mark all notifications as read
  async markAllAsRead() {
    await api.post('/notifications/read-all', {});
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Delete all notifications
  async deleteAllNotifications() {
    await api.delete('/notifications');
  },

  // Register push token
  async registerPushToken(token, platform, deviceId = null) {
    await api.post('/notifications/push-token', {
      token,
      platform,
      device_id: deviceId,
    });
  },

  // Unregister push token
  async unregisterPushToken(token) {
    await api.delete(`/notifications/push-token?token=${encodeURIComponent(token)}`);
  },

  // Get notification preferences
  async getPreferences() {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    await api.put('/notifications/preferences', preferences);
  },
};

export default notificationsApi;
