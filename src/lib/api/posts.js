/**
 * Posts API Service
 * Handles posts, likes, comments, and feed
 */

import api from './client';

export const postsApi = {
  // Create a new post
  async createPost(caption, visibility = 'public', location = null) {
    const response = await api.post('/posts', {
      caption,
      visibility,
      location,
    });
    return response.data;
  },

  // Get a single post
  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Update a post
  async updatePost(postId, updates) {
    const response = await api.put(`/posts/${postId}`, updates);
    return response.data;
  },

  // Delete a post
  async deletePost(postId) {
    await api.delete(`/posts/${postId}`);
  },

  // Get feed (posts from followed users)
  async getFeed(type = 'following', limit = 20, offset = 0) {
    const response = await api.get(`/feed?type=${type}&limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Get user's posts
  async getUserPosts(userId, limit = 20, offset = 0) {
    const response = await api.get(`/users/${userId}/posts?limit=${limit}&offset=${offset}`);
    return {
      posts: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Like a post
  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`, {});
    return response;
  },

  // Unlike a post
  async unlikePost(postId) {
    const response = await api.post(`/posts/${postId}/unlike`, {});
    return response;
  },

  // Save a post
  async savePost(postId) {
    const response = await api.post(`/posts/${postId}/save`, {});
    return response;
  },

  // Unsave a post
  async unsavePost(postId) {
    const response = await api.post(`/posts/${postId}/unsave`, {});
    return response;
  },

  // Get saved posts
  async getSavedPosts(limit = 20, offset = 0) {
    const response = await api.get(`/posts/saved?limit=${limit}&offset=${offset}`);
    return {
      posts: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Create a comment
  async createComment(postId, content, parentId = null) {
    const response = await api.post(`/posts/${postId}/comments`, {
      content,
      parent_id: parentId,
    });
    return response.data;
  },

  // Get post comments
  async getComments(postId, limit = 20, offset = 0) {
    const response = await api.get(`/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
    return {
      comments: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Delete a comment
  async deleteComment(commentId) {
    await api.delete(`/comments/${commentId}`);
  },
};

export default postsApi;
