/**
 * Messaging API Service
 * Handles conversations, messages, and WebSocket connection
 */

import api from './client';

export const messagingApi = {
  // Create a new conversation
  async createConversation(type, participantIds, name = null) {
    const response = await api.post('/conversations', {
      type,
      participant_ids: participantIds,
      name,
    });
    return response.data;
  },

  // Get all conversations
  async getConversations(limit = 20, offset = 0) {
    const response = await api.get(`/conversations?limit=${limit}&offset=${offset}`);
    return {
      conversations: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Get a single conversation
  async getConversation(conversationId) {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  },

  // Get or create direct conversation with a user
  async getOrCreateDirect(userId) {
    const response = await api.post(`/conversations/direct/${userId}`, {});
    return response.data;
  },

  // Leave a conversation
  async leaveConversation(conversationId) {
    await api.post(`/conversations/${conversationId}/leave`, {});
  },

  // Send a message
  async sendMessage(conversationId, content, messageType = 'text', mediaUrl = null, parentMessageId = null) {
    const response = await api.post(`/conversations/${conversationId}/messages`, {
      content,
      message_type: messageType,
      media_url: mediaUrl,
      parent_message_id: parentMessageId,
    });
    return response.data;
  },

  // Get messages in a conversation
  async getMessages(conversationId, limit = 50, offset = 0) {
    const response = await api.get(`/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`);
    return {
      messages: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Edit a message
  async editMessage(messageId, content) {
    const response = await api.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  // Delete a message
  async deleteMessage(messageId) {
    await api.delete(`/messages/${messageId}`);
  },

  // Mark conversation as read
  async markAsRead(conversationId, messageId) {
    await api.post(`/conversations/${conversationId}/read`, {
      message_id: messageId,
    });
  },

  // Get total unread count
  async getUnreadCount() {
    const response = await api.get('/messages/unread');
    return response.data.unread_count;
  },
};

// WebSocket connection manager
export class ChatSocket {
  constructor(userId, token) {
    this.userId = userId;
    this.token = token;
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    this.socket = new WebSocket(`${wsUrl}/ws?token=${this.token}&user_id=${this.userId}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', null);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected', null);
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data);
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(type, data = {}) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, ...data }));
    }
  }

  subscribeToConversation(conversationId) {
    this.send('subscribe', { conversation_id: conversationId });
  }

  unsubscribeFromConversation(conversationId) {
    this.send('unsubscribe', { conversation_id: conversationId });
  }

  sendTyping(conversationId) {
    this.send('typing', { conversation_id: conversationId });
  }

  sendStopTyping(conversationId) {
    this.send('stop_typing', { conversation_id: conversationId });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

export default messagingApi;
