// Messaging API
import { api } from './client';

export const messagingApi = {
  // Get conversations
  async getConversations(page = 1, limit = 20) {
    const response = await api.get(`/messages/conversations?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Get or create conversation with user
  async getOrCreateConversation(userId) {
    const response = await api.post('/messages/conversations', { user_id: userId });
    return response.data || response;
  },

  // Get messages in conversation
  async getMessages(conversationId, page = 1, limit = 50) {
    const response = await api.get(`/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Send message
  async sendMessage(conversationId, content) {
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, { content });
    return response.data || response;
  },

  // Send message with media
  async sendMediaMessage(conversationId, formData) {
    const response = await api.uploadFile(`/messages/conversations/${conversationId}/messages/media`, formData);
    return response.data || response;
  },

  // Mark messages as read
  async markAsRead(conversationId) {
    const response = await api.post(`/messages/conversations/${conversationId}/read`, {});
    return response.data || response;
  },

  // Delete message
  async deleteMessage(conversationId, messageId) {
    const response = await api.delete(`/messages/conversations/${conversationId}/messages/${messageId}`);
    return response.data || response;
  },

  // Delete conversation
  async deleteConversation(conversationId) {
    const response = await api.delete(`/messages/conversations/${conversationId}`);
    return response.data || response;
  },

  // Get unread count
  async getUnreadCount() {
    const response = await api.get('/messages/unread/count');
    return response.data || response;
  },

  // Mute conversation
  async muteConversation(conversationId) {
    const response = await api.post(`/messages/conversations/${conversationId}/mute`, {});
    return response.data || response;
  },

  // Unmute conversation
  async unmuteConversation(conversationId) {
    const response = await api.delete(`/messages/conversations/${conversationId}/mute`);
    return response.data || response;
  },

  // Block user in messages
  async blockUserInMessages(userId) {
    const response = await api.post(`/messages/block/${userId}`, {});
    return response.data || response;
  },
};
