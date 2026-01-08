/**
 * Stories API Service
 * Handles 24-hour stories, highlights, and story views
 */

import api from './client';

export const storiesApi = {
  // Create a new story
  async createStory(mediaUrl, mediaType, caption = null, duration = 5) {
    const response = await api.post('/stories', {
      media_url: mediaUrl,
      media_type: mediaType,
      caption,
      duration,
    });
    return response.data;
  },

  // Get a single story
  async getStory(storyId) {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  },

  // Delete a story
  async deleteStory(storyId) {
    await api.delete(`/stories/${storyId}`);
  },

  // Get stories feed (stories from followed users)
  async getStoriesFeed() {
    const response = await api.get('/stories/feed');
    return response.data;
  },

  // Get user's stories
  async getUserStories(userId) {
    const response = await api.get(`/users/${userId}/stories`);
    return response.data;
  },

  // Mark story as viewed
  async viewStory(storyId) {
    const response = await api.post(`/stories/${storyId}/view`, {});
    return response;
  },

  // Get story viewers (owner only)
  async getStoryViewers(storyId, limit = 20, offset = 0) {
    const response = await api.get(`/stories/${storyId}/viewers?limit=${limit}&offset=${offset}`);
    return {
      viewers: response.data,
      total: response.meta?.total || 0,
    };
  },

  // Create a highlight
  async createHighlight(title, storyIds, coverImage = null) {
    const response = await api.post('/highlights', {
      title,
      story_ids: storyIds,
      cover_image: coverImage,
    });
    return response.data;
  },

  // Get user's highlights
  async getUserHighlights(userId) {
    const response = await api.get(`/users/${userId}/highlights`);
    return response.data;
  },

  // Delete a highlight
  async deleteHighlight(highlightId) {
    await api.delete(`/highlights/${highlightId}`);
  },

  // Add stories to highlight
  async addToHighlight(highlightId, storyIds) {
    const response = await api.post(`/highlights/${highlightId}/stories`, {
      story_ids: storyIds,
    });
    return response;
  },
};

export default storiesApi;
