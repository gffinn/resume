import { useState, useEffect, useRef } from 'react';
import { useContact } from '../hooks/useContact';
import { motion } from 'framer-motion';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // Honeypot field - should remain empty
  });

  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const { sendMessage, isSubmitting, error, success, reset } = useContact();

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  // Track mouse position for glow effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlowPosition({ x, y });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check honeypot field - if filled, it's likely a bot
    if (formData.website) {
      // Silently fail for bots - don't show error message
      console.warn('Bot detected via honeypot field');
      return;
    }

    const result = await sendMessage(formData);

    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
      });
    }
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'subject', label: 'Subject', type: 'text' },
  ];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        ref={cardRef}
        className={styles.glassCard}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Cursor glow effect */}
        <div
          className={styles.cursorGlow}
          style={{
            left: `${glowPosition.x}px`,
            top: `${glowPosition.y}px`,
          }}
        />

        <form className={styles.form} onSubmit={handleSubmit}>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Let's Connect
          </motion.h2>

          {/* Staggered form fields */}
          {fields.map((field, index) => (
            <motion.div
              key={field.name}
              className={styles.formGroup}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <label htmlFor={field.name} className={styles.label}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </motion.div>
          ))}

          {/* Honeypot field - hidden from humans, visible to bots */}
          <div
            style={{
              position: 'absolute',
              left: '-9999px',
              opacity: 0,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <label htmlFor="website">Website (leave blank)</label>
            <input
              type="text"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>

          {/* Message field */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              rows="6"
              required
            />
          </motion.div>

          {/* Success/Error messages */}
          {success && (
            <motion.div
              className={styles.successMessage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Message sent successfully!
            </motion.div>
          )}

          {error && (
            <motion.div
              className={styles.errorMessage}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
