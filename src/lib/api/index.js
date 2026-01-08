/**
 * Kiekky API Services
 * Central export for all API services
 */

export { api, ApiError } from './client';
export { authApi } from './auth';
export { usersApi } from './users';
export { postsApi } from './posts';
export { storiesApi } from './stories';
export { messagingApi, ChatSocket } from './messaging';
export { notificationsApi } from './notifications';

// Convenience re-exports
import api from './client';
import authApi from './auth';
import usersApi from './users';
import postsApi from './posts';
import storiesApi from './stories';
import messagingApi from './messaging';
import notificationsApi from './notifications';

const kiekkyApi = {
  client: api,
  auth: authApi,
  users: usersApi,
  posts: postsApi,
  stories: storiesApi,
  messaging: messagingApi,
  notifications: notificationsApi,
};

export default kiekkyApi;
