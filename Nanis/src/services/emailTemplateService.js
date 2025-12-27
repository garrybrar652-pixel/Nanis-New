import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const emailTemplateService = {
  // Get all templates
  async getAllTemplates() {
    const response = await axios.get(`${API_BASE_URL}/email-templates`);
    return response.data;
  },

  // Get single template
  async getTemplate(id) {
    const response = await axios.get(`${API_BASE_URL}/email-templates/${id}`);
    return response.data;
  },

  // Create new template
  async createTemplate(template) {
    const response = await axios.post(`${API_BASE_URL}/email-templates`, template);
    return response.data;
  },

  // Update template
  async updateTemplate(id, template) {
    const response = await axios.put(`${API_BASE_URL}/email-templates/${id}`, template);
    return response.data;
  },

  // Delete template
  async deleteTemplate(id) {
    const response = await axios.delete(`${API_BASE_URL}/email-templates/${id}`);
    return response.data;
  },

  // Render template to HTML
  async renderToHtml(document) {
    const response = await axios.post(`${API_BASE_URL}/email-templates/render`, {
      document,
    });
    return response. data. html;
  },

  // Send test email
  async sendTestEmail(templateId, recipientEmail) {
    const response = await axios. post(`${API_BASE_URL}/email-templates/${templateId}/send-test`, {
      recipientEmail,
    });
    return response.data;
  },
};