// Messaging API - Endpoints matched to backend routes
import { api } from './client';

export const messagingApi = {
  // Get all conversations - Backend: GET /conversations
  async getConversations(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/conversations${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Create conversation - Backend: POST /conversations
  async createConversation(participantIds, name = null, isGroup = false) {
    const body = { participant_ids: participantIds, is_group: isGroup };
    if (name) body.name = name;
    const response = await api.post('/conversations', body);
    return response.data || response;
  },

  // Get single conversation - Backend: GET /conversations/{id}
  async getConversation(conversationId) {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data || response;
  },

  // Get or create direct conversation - Backend: POST /conversations/direct/{user_id}
  async getOrCreateDirect(userId) {
    const response = await api.post(`/conversations/direct/${userId}`, {});
    return response.data || response;
  },

  // Leave conversation - Backend: POST /conversations/{id}/leave
  async leaveConversation(conversationId) {
    const response = await api.post(`/conversations/${conversationId}/leave`, {});
    return response.data || response;
  },

  // Get messages - Backend: GET /conversations/{id}/messages
  async getMessages(conversationId, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/conversations/${conversationId}/messages${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Send message - Backend: POST /conversations/{id}/messages
  async sendMessage(conversationId, content, messageType = 'text', mediaUrl = null) {
    const body = { content, message_type: messageType };
    if (mediaUrl) body.media_url = mediaUrl;
    const response = await api.post(`/conversations/${conversationId}/messages`, body);
    return response.data || response;
  },

  // Mark conversation as read - Backend: POST /conversations/{id}/read
  async markAsRead(conversationId, messageId = null) {
    const body = messageId ? { message_id: messageId } : {};
    const response = await api.post(`/conversations/${conversationId}/read`, body);
    return response.data || response;
  },

  // Edit message - Backend: PUT /messages/{id}
  async editMessage(messageId, content) {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data || response;
  },

  // Delete message - Backend: DELETE /messages/{id}
  async deleteMessage(messageId) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data || response;
  },

  // Get unread count - Backend: GET /messages/unread
  async getUnreadCount() {
    const response = await api.get('/messages/unread');
    return response.data || response;
  },
};
