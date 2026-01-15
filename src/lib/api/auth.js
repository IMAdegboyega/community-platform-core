// Auth API
import { api } from './client';

export const authApi = {
  // Register a new user
  async register(email, username, password, phone = null) {
    const response = await api.post('/auth/register', {
      email,
      username,
      password,
      phone,
    }, { includeAuth: false });
    return response.data || response;
  },

  // Login user
  async login(identifier, password, deviceInfo = null) {
    const response = await api.post('/auth/login', {
      identifier,
      password,
      device_info: deviceInfo,
    }, { includeAuth: false });
    
    // Response structure: { success: true, data: { access_token, refresh_token, user } }
    const loginData = response.data || response;
    
    if (loginData && loginData.access_token) {
      api.setToken(loginData.access_token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', loginData.refresh_token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
      }
    }
    
    return loginData;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout', {});
    } finally {
      api.clearAuth();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
    }
  },

  // Refresh token
  async refreshToken() {
    if (typeof window === 'undefined') return null;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    }, { includeAuth: false });

    const data = response.data || response;
    if (data && data.access_token) {
      api.setToken(data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;
  },

  // Get current user
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data || response;
  },

  // Update password
  async updatePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data || response;
  },

  // Request password reset
  async requestPasswordReset(email) {
    const response = await api.post('/auth/password/reset', { email }, { includeAuth: false });
    return response.data || response;
  },

  // Verify email
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data || response;
  },

  // Check if authenticated
  isAuthenticated() {
    return api.isAuthenticated();
  },

  // Get stored user
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};
