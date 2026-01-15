// Posts API
import { api } from './client';

export const postsApi = {
  // Get feed
  async getFeed(page = 1, limit = 20) {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Get post by ID
  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data || response;
  },

  // Get user's posts
  async getUserPosts(userId, page = 1, limit = 20) {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Create post
  async createPost(formData) {
    const response = await api.uploadFile('/posts', formData);
    return response.data || response;
  },

  // Create text-only post
  async createTextPost(content) {
    const response = await api.post('/posts', { content });
    return response.data || response;
  },

  // Update post
  async updatePost(postId, data) {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data || response;
  },

  // Delete post
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data || response;
  },

  // Like post
  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`, {});
    return response.data || response;
  },

  // Unlike post
  async unlikePost(postId) {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data || response;
  },

  // Get post likes
  async getPostLikes(postId, page = 1, limit = 20) {
    const response = await api.get(`/posts/${postId}/likes?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Add comment
  async addComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data || response;
  },

  // Get comments
  async getComments(postId, page = 1, limit = 20) {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Delete comment
  async deleteComment(postId, commentId) {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data || response;
  },

  // Save post
  async savePost(postId) {
    const response = await api.post(`/posts/${postId}/save`, {});
    return response.data || response;
  },

  // Unsave post
  async unsavePost(postId) {
    const response = await api.delete(`/posts/${postId}/save`);
    return response.data || response;
  },

  // Get saved posts
  async getSavedPosts(page = 1, limit = 20) {
    const response = await api.get(`/posts/saved?page=${page}&limit=${limit}`);
    return response.data || response;
  },

  // Report post
  async reportPost(postId, reason) {
    const response = await api.post(`/posts/${postId}/report`, { reason });
    return response.data || response;
  },

  // Share post
  async sharePost(postId, platform) {
    const response = await api.post(`/posts/${postId}/share`, { platform });
    return response.data || response;
  },
};
