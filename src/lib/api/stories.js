// Stories API
import { api } from './client';

export const storiesApi = {
  // Get stories feed
  async getStoriesFeed() {
    const response = await api.get('/stories/feed');
    return response.data || response;
  },

  // Get user's stories
  async getUserStories(userId) {
    const response = await api.get(`/stories/user/${userId}`);
    return response.data || response;
  },

  // Get single story
  async getStory(storyId) {
    const response = await api.get(`/stories/${storyId}`);
    return response.data || response;
  },

  // Create story
  async createStory(formData) {
    const response = await api.uploadFile('/stories', formData);
    return response.data || response;
  },

  // Delete story
  async deleteStory(storyId) {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data || response;
  },

  // View story (mark as seen)
  async viewStory(storyId) {
    const response = await api.post(`/stories/${storyId}/view`, {});
    return response.data || response;
  },

  // Get story viewers
  async getStoryViewers(storyId) {
    const response = await api.get(`/stories/${storyId}/viewers`);
    return response.data || response;
  },

  // React to story
  async reactToStory(storyId, reaction) {
    const response = await api.post(`/stories/${storyId}/react`, { reaction });
    return response.data || response;
  },

  // Reply to story
  async replyToStory(storyId, message) {
    const response = await api.post(`/stories/${storyId}/reply`, { message });
    return response.data || response;
  },
};
