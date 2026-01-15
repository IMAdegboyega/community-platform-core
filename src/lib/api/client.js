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
      console.log(`[API] ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      // Handle empty responses
      const text = await response.text();
      let data = null;
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('[API] Failed to parse response:', text);
          if (!response.ok) {
            throw new ApiError(`Server error: ${text || response.statusText}`, response.status, null);
          }
        }
      }

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          this.clearAuth();
          if (typeof window !== 'undefined' && !endpoint.includes('/auth/')) {
            window.location.href = '/sign-in';
          }
        }
        
        const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, data);
      }

      return data || {};
    } catch (error) {
      console.error('[API] Request error:', error);
      if (error instanceof ApiError) throw error;
      
      // Check if it's a network error (backend not reachable)
      if (error.message === 'Failed to fetch') {
        throw new ApiError('Cannot connect to server. Please check your internet connection or try again later.', 0, null);
      }
      
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
