// API Client for Kiekky Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
    this.token = null;
    this.refreshPromise = null; // Prevent multiple simultaneous refresh attempts
    
    // Initialize token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  setRefreshToken(refreshToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Attempt to refresh the access token
  async refreshAccessToken() {
    // If already refreshing, wait for that to complete
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      throw new ApiError('No refresh token available', 401, null);
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.clearAuth();
          throw new ApiError('Token refresh failed', response.status, data);
        }

        const tokenData = data.data || data;
        if (tokenData.access_token) {
          this.setToken(tokenData.access_token);
          if (tokenData.refresh_token) {
            this.setRefreshToken(tokenData.refresh_token);
          }
          if (tokenData.user && typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(tokenData.user));
          }
          return true;
        }

        this.clearAuth();
        throw new ApiError('Invalid refresh response', 401, data);
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request(endpoint, options = {}) {
    const { includeAuth = true, _isRetry = false, ...fetchOptions } = options;
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
      });

      // Handle empty response (204 No Content)
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const data = await response.json();

      if (!response.ok) {
        // If unauthorized and we haven't retried yet, try refreshing token
        if (response.status === 401 && includeAuth && !_isRetry) {
          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            return this.request(endpoint, { ...options, _isRetry: true });
          } catch (refreshError) {
            // Refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
            }
            throw new ApiError('Session expired. Please log in again.', 401, null);
          }
        }
        throw new ApiError(data.error || 'Request failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || 'Network error', 0, null);
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async uploadFile(endpoint, formData, options = {}) {
    const { includeAuth = true, _isRetry = false } = options;
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {};
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // If unauthorized and we haven't retried yet, try refreshing token
        if (response.status === 401 && includeAuth && !_isRetry) {
          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            return this.uploadFile(endpoint, formData, { ...options, _isRetry: true });
          } catch (refreshError) {
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
            }
            throw new ApiError('Session expired. Please log in again.', 401, null);
          }
        }
        throw new ApiError(data.error || 'Upload failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || 'Network error', 0, null);
    }
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient();
export { ApiError };
