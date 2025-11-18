import { contactService } from './contactService';
import { apiClient } from '../client';

// Mock the ApiClient
jest.mock('../client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('contactService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message with all required fields', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        website: '',
      };

      const mockResponse = { success: true, id: '123' };
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await contactService.sendMessage(formData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message',
          website: '',
          createdAt: expect.any(String),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should include createdAt timestamp in ISO format', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      apiClient.post.mockResolvedValueOnce({ success: true });
      await contactService.sendMessage(formData);

      const callArgs = apiClient.post.mock.calls[0][1];
      expect(callArgs.createdAt).toBeDefined();
      expect(new Date(callArgs.createdAt).toISOString()).toBe(
        callArgs.createdAt
      );
    });

    it('should handle honeypot field (website)', async () => {
      const formData = {
        name: 'Bot',
        email: 'bot@example.com',
        subject: 'Spam',
        message: 'Spam message',
        website: 'http://spam.com',
      };

      apiClient.post.mockResolvedValueOnce({ success: true });
      await contactService.sendMessage(formData);

      const callArgs = apiClient.post.mock.calls[0][1];
      expect(callArgs.website).toBe('http://spam.com');
    });

    it('should handle API errors', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test',
        website: '',
      };

      const error = new Error('Network error');
      apiClient.post.mockRejectedValueOnce(error);

      await expect(contactService.sendMessage(formData)).rejects.toThrow(
        'Network error'
      );
    });

    it('should preserve all form data fields', async () => {
      const formData = {
        name: 'Jane Smith',
        email: 'jane@test.com',
        subject: 'Important Subject',
        message:
          'This is a very important message with special characters: !@#$%',
        website: '',
      };

      apiClient.post.mockResolvedValueOnce({ success: true });
      await contactService.sendMessage(formData);

      const callArgs = apiClient.post.mock.calls[0][1];
      expect(callArgs.name).toBe('Jane Smith');
      expect(callArgs.email).toBe('jane@test.com');
      expect(callArgs.subject).toBe('Important Subject');
      expect(callArgs.message).toBe(
        'This is a very important message with special characters: !@#$%'
      );
    });

    it('should handle empty optional fields', async () => {
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: '',
        message: '',
        website: '',
      };

      apiClient.post.mockResolvedValueOnce({ success: true });
      await contactService.sendMessage(formData);

      const callArgs = apiClient.post.mock.calls[0][1];
      expect(callArgs.subject).toBe('');
      expect(callArgs.message).toBe('');
    });
  });

  describe('getMessages', () => {
    it('should fetch all messages', async () => {
      const mockMessages = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test 1',
          message: 'Message 1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Test 2',
          message: 'Message 2',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      apiClient.get.mockResolvedValueOnce(mockMessages);

      const result = await contactService.getMessages();

      expect(apiClient.get).toHaveBeenCalledWith('/api/contact');
      expect(result).toEqual(mockMessages);
    });

    it('should handle empty message list', async () => {
      apiClient.get.mockResolvedValueOnce([]);

      const result = await contactService.getMessages();

      expect(result).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to fetch messages');
      apiClient.get.mockRejectedValueOnce(error);

      await expect(contactService.getMessages()).rejects.toThrow(
        'Failed to fetch messages'
      );
    });

    it('should return message data with correct structure', async () => {
      const mockMessages = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'Test message content',
          website: '',
          createdAt: '2024-01-01T12:00:00.000Z',
        },
      ];

      apiClient.get.mockResolvedValueOnce(mockMessages);

      const result = await contactService.getMessages();

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('subject');
      expect(result[0]).toHaveProperty('message');
      expect(result[0]).toHaveProperty('createdAt');
    });
  });

  describe('integration between sendMessage and getMessages', () => {
    it('should be able to send and then retrieve messages', async () => {
      const formData = {
        name: 'Integration Test',
        email: 'integration@test.com',
        subject: 'Test',
        message: 'Test message',
        website: '',
      };

      const sentMessage = {
        id: 'new-id',
        ...formData,
        createdAt: new Date().toISOString(),
      };

      apiClient.post.mockResolvedValueOnce({
        success: true,
        data: sentMessage,
      });
      apiClient.get.mockResolvedValueOnce([sentMessage]);

      await contactService.sendMessage(formData);
      const messages = await contactService.getMessages();

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/contact',
        expect.any(Object)
      );
      expect(apiClient.get).toHaveBeenCalledWith('/api/contact');
      expect(messages).toContainEqual(sentMessage);
    });
  });
});
