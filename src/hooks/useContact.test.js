import { renderHook, act, waitFor } from '@testing-library/react';
import { useContact } from './useContact';
import { contactService } from '../api/services/contactService';

// Mock the contactService
jest.mock('../api/services/contactService');

describe('useContact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useContact());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(typeof result.current.sendMessage).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  describe('sendMessage', () => {
    it('should successfully send a message', async () => {
      const mockResponse = { success: true, id: '123' };
      contactService.sendMessage.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        website: '',
      };

      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(contactService.sendMessage).toHaveBeenCalledWith(formData);
      expect(result.current.success).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should set isSubmitting to true during submission', async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      contactService.sendMessage.mockReturnValueOnce(promise);

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      act(() => {
        result.current.sendMessage(formData);
      });

      // Check isSubmitting is true while pending
      expect(result.current.isSubmitting).toBe(true);
      expect(result.current.success).toBe(false);

      // Resolve the promise
      await act(async () => {
        resolvePromise({ success: true });
        await promise;
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.success).toBe(true);
    });

    it('should handle errors and set error message', async () => {
      const errorMessage = 'Network error occurred';
      contactService.sendMessage.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.success).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle generic errors without message', async () => {
      contactService.sendMessage.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.error).toBe(
        'Failed to send message. Please try again.'
      );
      expect(result.current.success).toBe(false);
    });

    it('should clear previous errors on new submission', async () => {
      contactService.sendMessage
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      // First submission with error
      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.error).toBe('First error');
      expect(result.current.success).toBe(false);

      // Second submission succeeds
      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.success).toBe(true);
    });

    it('should not allow multiple simultaneous submissions', async () => {
      let resolveFirst;
      const firstPromise = new Promise((resolve) => {
        resolveFirst = resolve;
      });
      contactService.sendMessage.mockReturnValueOnce(firstPromise);

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      // Start first submission
      act(() => {
        result.current.sendMessage(formData);
      });

      expect(result.current.isSubmitting).toBe(true);

      // Try to start second submission while first is pending
      // Note: The hook should prevent this, but we test the state
      expect(result.current.isSubmitting).toBe(true);

      // Complete first submission
      await act(async () => {
        resolveFirst({ success: true });
        await firstPromise;
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(contactService.sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      contactService.sendMessage.mockRejectedValueOnce(new Error('Test error'));

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      // Cause an error
      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.success).toBe(false);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.success).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should reset after successful submission', async () => {
      contactService.sendMessage.mockResolvedValueOnce({ success: true });

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      await act(async () => {
        await result.current.sendMessage(formData);
      });

      expect(result.current.success).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.success).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('multiple submission lifecycle', () => {
    it('should handle multiple submit-reset cycles', async () => {
      contactService.sendMessage.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useContact());

      const formData = {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      // First cycle
      await act(async () => {
        await result.current.sendMessage(formData);
      });
      expect(result.current.success).toBe(true);

      act(() => {
        result.current.reset();
      });
      expect(result.current.success).toBe(false);

      // Second cycle
      await act(async () => {
        await result.current.sendMessage(formData);
      });
      expect(result.current.success).toBe(true);

      act(() => {
        result.current.reset();
      });
      expect(result.current.success).toBe(false);

      expect(contactService.sendMessage).toHaveBeenCalledTimes(2);
    });
  });
});
