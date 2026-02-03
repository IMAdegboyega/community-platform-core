// Notifications API - Endpoints matched to backend routes
import { api } from './client';

export const notificationsApi = {
  // Get notifications - Backend: GET /notifications
  async getNotifications(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/notifications${queryString ? '?' + queryString : ''}`);
    console.log('notificationsApi.getNotifications - raw response:', JSON.stringify(response, null, 2));
    return response.data || response;
  },

  // Get unread count - Backend: GET /notifications/unread-count (NOT unread/count!)
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count');
    console.log('notificationsApi.getUnreadCount - raw response:', response);
    return response.data || response;
  },

  // Mark notification as read - Backend: POST /notifications/{id}/read (NOT PUT!)
  async markAsRead(notificationId) {
    const response = await api.post(`/notifications/${notificationId}/read`, {});
    return response.data || response;
  },

  // Mark all as read - Backend: POST /notifications/read-all (NOT PUT!)
  async markAllAsRead() {
    const response = await api.post('/notifications/read-all', {});
    return response.data || response;
  },

  // Delete notification - Backend: DELETE /notifications/{id}
  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data || response;
  },

  // Clear all notifications - Backend: DELETE /notifications
  async clearAll() {
    const response = await api.delete('/notifications');
    return response.data || response;
  },

  // Get notification preferences - Backend: GET /notifications/preferences
  async getPreferences() {
    const response = await api.get('/notifications/preferences');
    return response.data || response;
  },

  // Update notification preferences - Backend: PUT /notifications/preferences
  async updatePreferences(preferences) {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data || response;
  },

  // Register push token - Backend: POST /notifications/push-token
  async registerPushToken(token, platform, deviceInfo = null) {
    const body = { token, platform };
    if (deviceInfo) body.device_info = deviceInfo;
    const response = await api.post('/notifications/push-token', body);
    return response.data || response;
  },

  // Unregister push token - Backend: DELETE /notifications/push-token?token=xxx
  async unregisterPushToken(token) {
    const response = await api.delete(`/notifications/push-token?token=${encodeURIComponent(token)}`);
    return response.data || response;
  },
};
