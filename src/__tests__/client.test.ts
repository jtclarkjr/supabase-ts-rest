import { createSupabaseClient } from '../client/index';
import { createClient } from '../index';
import { describe, expect, it } from "bun:test";


describe('SupabaseClient', () => {
  const baseUrl = 'https://example.supabase.co';
  const apiKey = 'your_api_key';
  const token = 'your_token';

  describe('constructor', () => {
    it('should create a new client with correct configuration', () => {
      const client = createSupabaseClient({ baseUrl, apiKey, token });

      expect(client.baseUrl).toBe(baseUrl);
      expect(client.apiKey).toBe(apiKey);
      expect(client.getToken()).toBe(token);
    });

    it('should create a client without token', () => {
      const client = createSupabaseClient({ baseUrl, apiKey });

      expect(client.baseUrl).toBe(baseUrl);
      expect(client.apiKey).toBe(apiKey);
      expect(client.getToken()).toBeUndefined();
    });

    it('should throw error for invalid configuration', () => {
      expect(() => {
        createSupabaseClient({ baseUrl: '', apiKey });
      }).toThrow('Invalid client configuration');

      expect(() => {
        createSupabaseClient({ baseUrl, apiKey: '' });
      }).toThrow('Invalid client configuration');
    });
  });

  describe('createClient helper', () => {
    it('should create a new client using helper function', () => {
      const client = createClient(baseUrl, apiKey, token);

      expect(client.baseUrl).toBe(baseUrl);
      expect(client.apiKey).toBe(apiKey);
      expect(client.getToken()).toBe(token);
    });

    it('should create a client without token using helper function', () => {
      const client = createClient(baseUrl, apiKey);

      expect(client.baseUrl).toBe(baseUrl);
      expect(client.apiKey).toBe(apiKey);
      expect(client.getToken()).toBeUndefined();
    });
  });

  describe('token management', () => {
    it('should set and get token', () => {
      const client = createSupabaseClient({ baseUrl, apiKey });
      const newToken = 'new_token';

      client.setToken(newToken);
      expect(client.getToken()).toBe(newToken);
    });
  });
});
