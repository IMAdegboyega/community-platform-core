/**
 * Kiekky API Client
 * Base configuration for all API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  // Get auth token
  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  // Clear auth
  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Build headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const { includeAuth = true, ...fetchOptions } = options;

    const config = {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(includeAuth),
        ...fetchOptions.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined') {
            window.location.href = '/sign-in';
          }
        }
        throw new ApiError(data.error || 'Request failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(error.message || 'Network error', 0, null);
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Custom error class
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Export singleton instance
export const api = new ApiClient();
export { ApiError };
export default api;
