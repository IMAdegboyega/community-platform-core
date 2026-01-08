/**
 * Users API Service
 * Handles user profiles, follow/unfollow, and user search
 */

import api from './client';

export const usersApi = {
  // Get user profile by ID
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get user by username
  async getUserByUsername(username) {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },

  // Search users
  async searchUsers(query, limit = 20, offset = 0) {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get suggested users to follow
  async getSuggestions(limit = 10) {
    const response = await api.get(`/users/suggestions?limit=${limit}`);
    return response.data;
  },

  // Follow a user
  async follow(userId) {
    const response = await api.post(`/users/${userId}/follow`, {});
    return response;
  },

  // Unfollow a user
  async unfollow(userId) {
    const response = await api.post(`/users/${userId}/unfollow`, {});
    return response;
  },

  // Check follow status
  async checkFollowStatus(userId) {
    const response = await api.get(`/users/${userId}/follow-status`);
    return response.data;
  },

  // Get followers of a user
  async getFollowers(userId, limit = 20, offset = 0) {
    const response = await api.get(`/users/${userId}/followers?limit=${limit}&offset=${offset}`);
    return {
      users: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Get users that a user follows
  async getFollowing(userId, limit = 20, offset = 0) {
    const response = await api.get(`/users/${userId}/following?limit=${limit}&offset=${offset}`);
    return {
      users: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Block a user
  async block(userId, reason = null) {
    const response = await api.post(`/users/${userId}/block`, { reason });
    return response;
  },

  // Unblock a user
  async unblock(userId) {
    const response = await api.post(`/users/${userId}/unblock`, {});
    return response;
  },

  // Get blocked users
  async getBlockedUsers(limit = 20, offset = 0) {
    const response = await api.get(`/users/blocked?limit=${limit}&offset=${offset}`);
    return {
      users: response.data,
      total: response.meta?.total || 0,
    };
  },
};

export default usersApi;
