import apiClient from './client';

/**
 * Campaign Service
 * Handles all campaign-related API calls
 */

const campaignService = {
  /**
   * Get all campaigns with optional filters
   * @param {Object} params - { status?, category?, search?, sort_by?, sort_order?, per_page? }
   * @returns {Promise<Object>} - { success, data: [...campaigns] }
   */
  async getCampaigns(params = {}) {
    try {
      const response = await apiClient.get('/api/campaigns', { params });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch campaigns',
        errors: {},
      };
    }
  },

  /**
   * Get a single campaign by ID
   * @param {number} id - Campaign ID
   * @returns {Promise<Object>} - { success, data: campaign }
   */
  async getCampaign(id) {
    try {
      const response = await apiClient.get(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch campaign',
        errors: {},
      };
    }
  },

  /**
   * Create a new campaign
   * @param {Object} campaignData - Campaign data
   * @returns {Promise<Object>} - { success, data: campaign, message }
   */
  async createCampaign(campaignData) {
    try {
      const response = await apiClient.post('/api/campaigns', campaignData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to create campaign',
        errors: {},
      };
    }
  },

  /**
   * Update an existing campaign
   * @param {number} id - Campaign ID
   * @param {Object} campaignData - Updated campaign data
   * @returns {Promise<Object>} - { success, data: campaign, message }
   */
  async updateCampaign(id, campaignData) {
    try {
      const response = await apiClient.put(`/api/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to update campaign',
        errors: {},
      };
    }
  },

  /**
   * Delete a campaign
   * @param {number} id - Campaign ID
   * @returns {Promise<Object>} - { success, message }
   */
  async deleteCampaign(id) {
    try {
      const response = await apiClient.delete(`/api/campaigns/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to delete campaign',
        errors: {},
      };
    }
  },

  /**
   * Schedule a campaign
   * @param {number} id - Campaign ID
   * @param {string} scheduledAt - ISO date string
   * @returns {Promise<Object>} - { success, data: campaign, message }
   */
  async scheduleCampaign(id, scheduledAt) {
    try {
      const response = await apiClient.post(`/api/campaigns/${id}/schedule`, {
        scheduled_at: scheduledAt,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to schedule campaign',
        errors: {},
      };
    }
  },

  /**
   * Send a campaign immediately
   * @param {number} id - Campaign ID
   * @returns {Promise<Object>} - { success, data: campaign, message }
   */
  async sendCampaign(id) {
    try {
      const response = await apiClient.post(`/api/campaigns/${id}/send`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to send campaign',
        errors: {},
      };
    }
  },

  /**
   * Suspend a campaign
   * @param {number} id - Campaign ID
   * @returns {Promise<Object>} - { success, data: campaign, message }
   */
  async suspendCampaign(id) {
    try {
      const response = await apiClient.post(`/api/campaigns/${id}/suspend`);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to suspend campaign',
        errors: {},
      };
    }
  },

  /**
   * Get campaign statistics
   * @returns {Promise<Object>} - { success, data: { total, draft, scheduled, sending, published, suspended, by_category } }
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/api/campaigns/statistics');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        success: false,
        message: 'Failed to fetch statistics',
        errors: {},
      };
    }
  },
};

export default campaignService;
