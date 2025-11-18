import { apiClient } from './client';

// Mock fetch globally
global.fetch = jest.fn();

// Helper to create mock response
const mockFetchResponse = (
  data,
  ok = true,
  contentType = 'application/json'
) => ({
  ok,
  headers: {
    get: (header) => {
      if (header.toLowerCase() === 'content-type') {
        return contentType;
      }
      return null;
    },
  },
  json: async () => data,
  text: async () => JSON.stringify(data),
});

describe('ApiClient', () => {
  let client;

  beforeEach(() => {
    process.env.REACT_APP_API_BASE_URL = 'https://example.com/api';
    client = apiClient;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('client instance', () => {
    it('should have base URL defined', () => {
      expect(client.baseURL).toBeDefined();
    });
  });

  describe('request', () => {
    it('should make a successful request and parse JSON', async () => {
      const mockData = { message: 'success' };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockData));

      const result = await client.request('/test');

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('should handle HTTP errors', async () => {
      global.fetch.mockResolvedValueOnce(
        mockFetchResponse({ message: 'Not found' }, false)
      );

      await expect(client.request('/test')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(client.request('/test')).rejects.toThrow();
    });

    it('should handle non-JSON responses', async () => {
      global.fetch.mockResolvedValueOnce(
        mockFetchResponse('Plain text', true, 'text/plain')
      );

      const result = await client.request('/test');
      expect(result).toBeDefined();
    });
  });

  describe('get', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockData));

      const result = await client.get('/users/1');

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe('post', () => {
    it('should make POST request with JSON body', async () => {
      const postData = { name: 'Test' };
      const mockResponse = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockResponse));

      const result = await client.post('/users', postData);

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('put', () => {
    it('should make PUT request with JSON body', async () => {
      const putData = { name: 'Updated' };
      const mockResponse = { id: 1, name: 'Updated' };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockResponse));

      const result = await client.put('/users/1', putData);

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('patch', () => {
    it('should make PATCH request with JSON body', async () => {
      const patchData = { status: 'active' };
      const mockResponse = { id: 1, status: 'active' };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockResponse));

      const result = await client.patch('/users/1', patchData);

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should make DELETE request', async () => {
      const mockResponse = { success: true };
      global.fetch.mockResolvedValueOnce(mockFetchResponse(mockResponse));

      const result = await client.delete('/users/1');

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});
