/**
 * Auth API Service
 * Handles authentication endpoints
 */

import api from './client';

export const authApi = {
  // Register a new user
  async register(email, username, password, phone = null) {
    const response = await api.post('/auth/register', {
      email,
      username,
      password,
      phone,
    }, { includeAuth: false });
    return response.data;
  },

  // Login user
  async login(identifier, password, deviceInfo = null) {
    const response = await api.post('/auth/login', {
      identifier,
      password,
      device_info: deviceInfo,
    }, { includeAuth: false });
    
    if (response.data) {
      api.setToken(response.data.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout', {});
    } finally {
      api.clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  },

  // Logout all devices
  async logoutAll() {
    try {
      await api.post('/auth/logout-all', {});
    } finally {
      api.clearAuth();
    }
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refresh_token') 
      : null;
      
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    }, { includeAuth: false });
    
    if (response.data) {
      api.setToken(response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },

  // Get current user
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response;
  },

  // Get active sessions
  async getSessions() {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  // Revoke a session
  async revokeSession(sessionId) {
    await api.delete(`/auth/sessions/${sessionId}`);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!api.getToken();
  },

  // Get stored user
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authApi;
