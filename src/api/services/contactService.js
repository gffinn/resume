import { apiClient } from '../client';

/**
 * Contact API service
 * Handles all contact-related API calls
 */
export const contactService = {
  /**
   * Send a contact form message
   * @param {Object} formData - The contact form data
   * @param {string} formData.name - Sender's name
   * @param {string} formData.email - Sender's email
   * @param {string} formData.subject - Message subject
   * @param {string} formData.message - Message content
   * @param {string} formData.website - Honeypot field (should be empty)
   * @returns {Promise<Object>} Response data
   */
  sendMessage: async (formData) => {
    const payload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };
    return apiClient.post('/api/contact', payload);
  },

  /**
   * Get contact messages
   * @returns {Promise<Array>} List of contact submissions
   */
  getMessages: async () => {
    return apiClient.get('/api/contact');
  },
};
