// Users API - Endpoints matched to backend routes
import { api } from './client';

export const usersApi = {
  // Get user by ID - Backend: GET /users/{id}
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data || response;
  },

  // Get user by username - Backend: GET /users/username/{username}
  async getUserByUsername(username) {
    const response = await api.get(`/users/username/${username}`);
    return response.data || response;
  },

  // Search users - Backend: GET /users/search?q=query
  async searchUsers(query, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await api.get(`/users/search?${params.toString()}`);
    return response.data || response;
  },

  // Get suggested users - Backend: GET /users/suggestions
  async getSuggestions(limit = 10) {
    const response = await api.get(`/users/suggestions?limit=${limit}`);
    return response.data || response;
  },

  // Follow user - Backend: POST /users/{id}/follow
  async follow(userId) {
    const response = await api.post(`/users/${userId}/follow`, {});
    return response.data || response;
  },

  // Unfollow user - Backend: POST /users/{id}/unfollow (NOT DELETE!)
  async unfollow(userId) {
    const response = await api.post(`/users/${userId}/unfollow`, {});
    return response.data || response;
  },

  // Check if following - Backend: GET /users/{id}/follow-status
  async isFollowing(userId) {
    const response = await api.get(`/users/${userId}/follow-status`);
    return response.data || response;
  },

  // Get followers - Backend: GET /users/{id}/followers
  async getFollowers(userId, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/users/${userId}/followers${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Get following - Backend: GET /users/{id}/following
  async getFollowing(userId, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/users/${userId}/following${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Block user - Backend: POST /users/{id}/block
  async blockUser(userId, reason = null) {
    const body = reason ? { reason } : {};
    const response = await api.post(`/users/${userId}/block`, body);
    return response.data || response;
  },

  // Unblock user - Backend: POST /users/{id}/unblock (NOT DELETE!)
  async unblockUser(userId) {
    const response = await api.post(`/users/${userId}/unblock`, {});
    return response.data || response;
  },

  // Get blocked users - Backend: GET /users/blocked
  async getBlockedUsers(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/users/blocked${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Update user profile - Backend: PUT /users/profile
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data || response;
  },

  // Upload profile picture - Backend: POST /users/profile/picture (if backend supports it)
  async uploadProfilePicture(formData) {
    const response = await api.uploadFile('/users/profile/picture', formData);
    return response.data || response;
  },
};
