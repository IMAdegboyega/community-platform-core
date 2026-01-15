// Users API
import { api } from './client';

export const usersApi = {
  // Get user by ID
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data || response;
  },

  // Get user by username
  async getUserByUsername(username) {
    const response = await api.get(`/users/username/${username}`);
    return response.data || response;
  },

  // Update profile
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data || response;
  },

  // Update profile picture
  async updateProfilePicture(formData) {
    const response = await api.uploadFile('/users/profile/picture', formData);
    return response.data || response;
  },

  // Update cover photo
  async updateCoverPhoto(formData) {
    const response = await api.uploadFile('/users/profile/cover', formData);
    return response.data || response;
  },

  // Search users
  async searchUsers(query, page = 1, limit = 20) {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Get suggested users
  async getSuggestions(limit = 10) {
    const response = await api.get(`/users/suggestions?limit=${limit}`);
    return response.data || response;
  },

  // Follow user
  async follow(userId) {
    const response = await api.post(`/users/${userId}/follow`, {});
    return response.data || response;
  },

  // Unfollow user
  async unfollow(userId) {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data || response;
  },

  // Get followers
  async getFollowers(userId, page = 1, limit = 20) {
    const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Get following
  async getFollowing(userId, page = 1, limit = 20) {
    const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Check if following
  async isFollowing(userId) {
    const response = await api.get(`/users/${userId}/following/check`);
    return response.data || response;
  },

  // Update privacy settings
  async updatePrivacySettings(settings) {
    const response = await api.put('/users/settings/privacy', settings);
    return response.data || response;
  },

  // Update notification settings
  async updateNotificationSettings(settings) {
    const response = await api.put('/users/settings/notifications', settings);
    return response.data || response;
  },

  // Block user
  async blockUser(userId) {
    const response = await api.post(`/users/${userId}/block`, {});
    return response.data || response;
  },

  // Unblock user
  async unblockUser(userId) {
    const response = await api.delete(`/users/${userId}/block`);
    return response.data || response;
  },

  // Report user
  async reportUser(userId, reason) {
    const response = await api.post(`/users/${userId}/report`, { reason });
    return response.data || response;
  },
};
