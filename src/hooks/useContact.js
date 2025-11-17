import { useState } from 'react';
import { contactService } from '../api/services/contactService';

/**
 * Custom hook for handling contact form submissions
 * @returns {Object} Contact form state and methods
 */
export function useContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Send a contact message
   * @param {Object} formData - The contact form data
   * @returns {Promise<Object>} Result object with success status
   */
  const sendMessage = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await contactService.sendMessage(formData);
      setSuccess(true);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage =
        err.message || 'Failed to send message. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset the form state
   */
  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  };

  return {
    sendMessage,
    isSubmitting,
    error,
    success,
    reset,
  };
}
