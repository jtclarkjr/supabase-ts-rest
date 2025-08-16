import {
  ClientConfig,
  AuthTokenResponse,
  TokenRequestPayload,
  QueryParams,
  HttpMethod,
  SupabaseError
} from '../types';
import {
  TOKEN_API_PATH,
  SIGNUP_API_PATH,
  MAGIC_LINK_API_PATH,
  RECOVER_API_PATH,
  VERIFY_API_PATH,
  USER_API_PATH,
  LOGOUT_API_PATH,
  INVITE_API_PATH,
  RESET_API_PATH,
  ERROR_MESSAGES
} from '../utils/constants';
import { createAuthMethods } from './auth';
import { createUserMethods } from './user';
import { createRestMethods } from './rest';

/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 * @param config - The client configuration object containing baseUrl, apiKey, and optional token.
 * @returns A Supabase client object with methods for authentication, user management, and REST operations.
 */
export function createSupabaseClient(config: ClientConfig) {
  if (!config.baseUrl || !config.apiKey) {
    throw new SupabaseError(ERROR_MESSAGES.INVALID_CONFIG);
  }

  let baseUrl = config.baseUrl;
  let apiKey = config.apiKey;
  let token = config.token;

  // Core HTTP request method
  /**
   * Core HTTP request method for making API calls.
   * @param method - HTTP method (GET, POST, etc.)
   * @param endpoint - API endpoint or full URL
   * @param queryParams - Optional query parameters
   * @param body - Optional request body
   * @returns The parsed JSON response or raw text
   * @throws SupabaseError if the request fails
   */
  async function doRequest(method: HttpMethod, endpoint: string, queryParams?: QueryParams, body?: unknown): Promise<unknown> {
    // Build URL
    let url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams as Record<string, string>).toString();
      url += (url.includes('?') ? '&' : '?') + params;
    }
    // Prepare headers
    const headers: Record<string, string> = {
      'apikey': apiKey,
      'Authorization': `Bearer ${token || apiKey}`,
      'Content-Type': 'application/json',
    };
    // Prepare fetch options
    const options: RequestInit = {
      method,
      headers,
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    // Make request
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new SupabaseError(`Request failed: ${response.status} ${text}`);
    }
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return text;
    }
  }

  // Auth request method
  /**
   * Auth-specific request method for authentication endpoints.
   * @param endpoint - Auth API endpoint or full URL
   * @param payload - Request payload for authentication
   * @returns The authentication token response
   * @throws SupabaseError if the request fails
   */
  async function authRequest(endpoint: string, payload: TokenRequestPayload): Promise<AuthTokenResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`;
    const headers: Record<string, string> = {
      'apikey': apiKey,
      'Authorization': `Bearer ${token || apiKey}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new SupabaseError(`Auth request failed: ${response.status} ${text}`);
    }
    return response.json();
  }

  // Create method groups
  const authMethods = createAuthMethods(doRequest, authRequest);
  const userMethods = createUserMethods(doRequest);
  const restMethods = createRestMethods(doRequest);

  // Return the client object with all methods
  return {
    // Properties
    baseUrl,
    apiKey,
    get token() { return token; },
    
    // Core methods
  /**
   * Sets the current authentication token for the client.
   * @param newToken - The new token to use for requests
   */
  setToken: (newToken: string) => { token = newToken; },
  /**
   * Gets the current authentication token used by the client.
   * @returns The current token string
   */
  getToken: () => token,
  /**
   * Exposes the core HTTP request method for advanced usage.
   */
  doRequest,
  /**
   * Exposes the auth-specific request method for advanced usage.
   */
  authRequest,

    // Auth methods
  /**
   * Authentication methods (signIn, signUp, etc.)
   */
  ...authMethods,

    // User methods
  /**
   * User management methods (getUser, updateUser, etc.)
   */
  ...userMethods,

    // REST methods
  /**
   * REST methods for interacting with tables and views.
   */
  ...restMethods,
  /**
   * Alias for the REST delete method (since 'delete' is a reserved word).
   */
  delete: restMethods.del, // Map 'delete' to 'del' since 'delete' is a reserved word

    // Constants for compatibility
    TOKEN_API_PATH,
    SIGNUP_API_PATH,
    MAGIC_LINK_API_PATH,
    RECOVER_API_PATH,
    VERIFY_API_PATH,
    USER_API_PATH,
    LOGOUT_API_PATH,
    INVITE_API_PATH,
    RESET_API_PATH,
    ERROR_MESSAGES,
  };
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
