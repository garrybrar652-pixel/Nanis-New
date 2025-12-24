import apiClient from './client';

/**
 * Authentication Service
 * Handles all auth-related API calls with Laravel Sanctum
 */

const authService = {
  /**
   * Get CSRF cookie from backend (required for Sanctum)
   */
  async getCsrfCookie() {
    try {
      await apiClient.get('/sanctum/csrf-cookie');
    } catch (error) {
      console.error('Failed to fetch CSRF cookie:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, password_confirmation, job_title?, company?, phone?, bio?, avatar? }
   * @returns {Promise<Object>} - { success, data: { user, token }, message }
   */
  async register(userData) {
    try {
      // First, get CSRF cookie
      await this.getCsrfCookie();
      
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Registration failed. Please try again.',
        errors: {},
      };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { success, data: { user, token }, message }
   */
  async login(credentials) {
    try {
      // First, get CSRF cookie
      await this.getCsrfCookie();
      
      const response = await apiClient.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Login failed. Please check your credentials.',
        errors: {},
      };
    }
  },

  /**
   * Logout user (requires authentication)
   * @returns {Promise<Object>} - { success, message }
   */
  async logout() {
    try {
      const response = await apiClient.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Logout failed.',
      };
    }
  },

  /**
   * Get authenticated user profile
   * @returns {Promise<Object>} - { success, data: { user }, message }
   */
  async getProfile() {
    try {
      const response = await apiClient.get('/api/user/profile');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch profile.',
      };
    }
  },

  /**
   * Get authenticated user (simple endpoint)
   * @returns {Promise<Object>} - User object
   */
  async getUser() {
    try {
      const response = await apiClient.get('/api/user');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch user.',
      };
    }
  },
};

export default authService;
