// Posts API - Endpoints matched to backend routes
import { api } from './client';

export const postsApi = {
  // Get feed - Backend: GET /feed
  async getFeed(type = '', limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/feed${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Get post by ID - Backend: GET /posts/{id}
  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data || response;
  },

  // Get user's posts - Backend: GET /users/{id}/posts
  async getUserPosts(userId, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/users/${userId}/posts${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Create post with media - Backend: POST /posts
  async createPost(formData) {
    const response = await api.uploadFile('/posts', formData);
    return response.data || response;
  },

  // Create text-only post - Backend: POST /posts
  async createTextPost(content) {
    const response = await api.post('/posts', { content });
    return response.data || response;
  },

  // Update post - Backend: PUT /posts/{id}
  async updatePost(postId, data) {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data || response;
  },

  // Delete post - Backend: DELETE /posts/{id}
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data || response;
  },

  // Like post - Backend: POST /posts/{id}/like
  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`, {});
    return response.data || response;
  },

  // Unlike post - Backend: POST /posts/{id}/unlike (NOT DELETE!)
  async unlikePost(postId) {
    const response = await api.post(`/posts/${postId}/unlike`, {});
    return response.data || response;
  },

  // Save post - Backend: POST /posts/{id}/save
  async savePost(postId) {
    const response = await api.post(`/posts/${postId}/save`, {});
    return response.data || response;
  },

  // Unsave post - Backend: POST /posts/{id}/unsave (NOT DELETE!)
  async unsavePost(postId) {
    const response = await api.post(`/posts/${postId}/unsave`, {});
    return response.data || response;
  },

  // Get saved posts - Backend: GET /posts/saved
  async getSavedPosts(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/posts/saved${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Add comment - Backend: POST /posts/{id}/comments
  async addComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data || response;
  },

  // Get comments - Backend: GET /posts/{id}/comments
  async getComments(postId, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/posts/${postId}/comments${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // Delete comment - Backend: DELETE /comments/{id} (NOT /posts/{postId}/comments/{commentId}!)
  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data || response;
  },
};
