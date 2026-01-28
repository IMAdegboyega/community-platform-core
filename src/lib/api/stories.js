// Stories API - Endpoints matched to backend routes
import { api } from './client';

export const storiesApi = {
  // Get stories feed - Backend: GET /stories/feed
  async getStoriesFeed() {
    const response = await api.get('/stories/feed');
    return response.data || response;
  },

  // Get user's stories - Backend: GET /users/{id}/stories (NOT /stories/user/{id}!)
  async getUserStories(userId) {
    const response = await api.get(`/users/${userId}/stories`);
    return response.data || response;
  },

  // Get single story - Backend: GET /stories/{id}
  async getStory(storyId) {
    const response = await api.get(`/stories/${storyId}`);
    return response.data || response;
  },

  // Create story - Backend: POST /stories
  async createStory(formData) {
    const response = await api.uploadFile('/stories', formData);
    return response.data || response;
  },

  // Delete story - Backend: DELETE /stories/{id}
  async deleteStory(storyId) {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data || response;
  },

  // View story (mark as seen) - Backend: POST /stories/{id}/view
  async viewStory(storyId) {
    const response = await api.post(`/stories/${storyId}/view`, {});
    return response.data || response;
  },

  // Get story viewers - Backend: GET /stories/{id}/viewers
  async getStoryViewers(storyId, limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString();
    const response = await api.get(`/stories/${storyId}/viewers${queryString ? '?' + queryString : ''}`);
    return response.data || response;
  },

  // === Highlights ===
  
  // Create highlight - Backend: POST /highlights
  async createHighlight(name, coverUrl = null) {
    const body = { name };
    if (coverUrl) body.cover_url = coverUrl;
    const response = await api.post('/highlights', body);
    return response.data || response;
  },

  // Get user highlights - Backend: GET /users/{id}/highlights
  async getUserHighlights(userId) {
    const response = await api.get(`/users/${userId}/highlights`);
    return response.data || response;
  },

  // Delete highlight - Backend: DELETE /highlights/{id}
  async deleteHighlight(highlightId) {
    const response = await api.delete(`/highlights/${highlightId}`);
    return response.data || response;
  },

  // Add stories to highlight - Backend: POST /highlights/{id}/stories
  async addToHighlight(highlightId, storyIds) {
    const response = await api.post(`/highlights/${highlightId}/stories`, { story_ids: storyIds });
    return response.data || response;
  },
};
