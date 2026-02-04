// Auth API - Endpoints matched to backend routes
import { api } from './client';

export const authApi = {
  // Register a new user - Backend: POST /auth/register
  async register(email, username, password, phone = null) {
    const body = { email, username, password };
    if (phone) body.phone = phone;
    
    const response = await api.post('/auth/register', body, { includeAuth: false });
    return response.data || response;
  },

  // Login user - Backend: POST /auth/login
  async login(identifier, password, deviceInfo = null) {
    const body = { identifier, password };
    if (deviceInfo) body.device_info = deviceInfo;
    
    const response = await api.post('/auth/login', body, { includeAuth: false });
    
    // Response structure: { success: true, data: { access_token, refresh_token, user, expires_in } }
    const loginData = response.data || response;
    
    if (loginData && loginData.access_token) {
      api.setToken(loginData.access_token);
      api.setRefreshToken(loginData.refresh_token);
      if (typeof window !== 'undefined' && loginData.user) {
        sessionStorage.setItem('user', JSON.stringify(loginData.user));
      }
    }
    
    return loginData;
  },

  // Logout - Backend: POST /auth/logout
  async logout() {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      // Ignore logout errors, still clear local auth
      console.warn('Logout request failed:', error);
    } finally {
      api.clearAuth();
    }
  },

  // Logout from all devices - Backend: POST /auth/logout-all
  async logoutAll() {
    try {
      await api.post('/auth/logout-all', {});
    } finally {
      api.clearAuth();
    }
  },

  // Refresh token - Backend: POST /auth/refresh
  async refreshToken() {
    if (typeof window === 'undefined') return null;
    
    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    }, { includeAuth: false });

    const data = response.data || response;
    if (data && data.access_token) {
      api.setToken(data.access_token);
      api.setRefreshToken(data.refresh_token);
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return data;
  },

  // Get current user - Backend: GET /auth/me
  async getMe() {
    const response = await api.get('/auth/me');
    const userData = response.data || response;
    return userData;
  },

  // Change password - Backend: POST /auth/change-password (NOT PUT /auth/password!)
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data || response;
  },

  // Get active sessions - Backend: GET /auth/sessions
  async getSessions() {
    const response = await api.get('/auth/sessions');
    return response.data || response;
  },

  // Revoke a specific session - Backend: DELETE /auth/sessions/{id}
  async revokeSession(sessionId) {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data || response;
  },

  // Check if authenticated (local check)
  isAuthenticated() {
    return api.isAuthenticated();
  },

  // Get stored user from sessionStorage
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update stored user in sessionStorage
  setStoredUser(user) {
    if (typeof window !== 'undefined' && user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  },
};
