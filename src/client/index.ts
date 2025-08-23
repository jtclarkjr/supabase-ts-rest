import {
  ClientConfig,
  AuthTokenResponse,
  TokenRequestPayload,
  MagicLinkPayload,
  VerifyOTPPayload,
  QueryParams,
  HttpMethod,
  SupabaseError
} from '../types'
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
} from '../utils/constants'

/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 */
export function createSupabaseClient(config: ClientConfig) {
  if (!config.baseUrl || !config.apiKey) {
    throw new SupabaseError(ERROR_MESSAGES.INVALID_CONFIG)
  }

  let baseUrl = config.baseUrl
  let apiKey = config.apiKey
  let token = config.token

  // Core HTTP request method
  async function request(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    queryParams?: QueryParams
  ): Promise<unknown> {
    // Build URL
    let url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(
        queryParams as Record<string, string>
      ).toString()
      url += (url.includes('?') ? '&' : '?') + params
    }
    // Prepare headers
    const headers: Record<string, string> = {
      apikey: apiKey,
      Authorization: `Bearer ${token || apiKey}`,
      'Content-Type': 'application/json'
    }
    // Prepare fetch options
    const options: RequestInit = {
      method,
      headers
    }
    if (body !== undefined) {
      options.body = JSON.stringify(body)
    }
    // Make request
    const response = await fetch(url, options)
    if (!response.ok) {
      const text = await response.text()
      throw new SupabaseError(`Request failed: ${response.status} ${text}`)
    }
    const text = await response.text()
    try {
      return text ? JSON.parse(text) : {}
    } catch {
      return text
    }
  }

  // Auth request method
  async function auth(
    endpoint: string,
    payload: TokenRequestPayload
  ): Promise<AuthTokenResponse> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${baseUrl}/${endpoint}`
    const headers: Record<string, string> = {
      apikey: apiKey,
      Authorization: `Bearer ${token || apiKey}`,
      'Content-Type': 'application/json'
    }
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const text = await response.text()
      throw new SupabaseError(`Auth request failed: ${response.status} ${text}`)
    }
    return response.json()
  }

  // Return the client object with all methods defined directly
  return {
    // Properties
    baseUrl,
    apiKey,
    get token() {
      return token
    },

    // Core methods
    /** Sets the authentication token. */
    setToken: (newToken: string) => {
      token = newToken
    },

    /** Gets the current authentication token. */
    getToken: () => token,
    
    /** Core HTTP request method. */
    request,
    
    /** Auth request method. */
    auth,

    // Auth methods
    /** Registers a new user with email and password. */
    async signUp(email: string, password: string): Promise<unknown> {
      const payload = { email, password }
      const path = `${SIGNUP_API_PATH}?grant_type=signup`
      return request('POST', path, payload)
    },

    /** Signs in a user with email and password. */
    async signIn(email: string, password: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { email, password }
      const path = `${TOKEN_API_PATH}?grant_type=password`
      return auth(path, payload)
    },

    /** Refreshes the authentication token. */
    async refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { refresh_token: refreshTokenValue }
      const path = `${TOKEN_API_PATH}?grant_type=refresh_token`
      return auth(path, payload)
    },

    /** Sends a magic link for passwordless sign-in. */
    async sendMagicLink(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return request('POST', MAGIC_LINK_API_PATH, payload)
    },

    /** Sends a password recovery email. */
    async sendPasswordRecovery(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return request('POST', RECOVER_API_PATH, payload)
    },

    /** Verifies an OTP code. */
    async verifyOTP(
      email: string,
      tokenValue: string,
      otpType: string
    ): Promise<unknown> {
      const payload: VerifyOTPPayload = {
        email,
        token: tokenValue,
        type: otpType
      }
      return request('POST', VERIFY_API_PATH, payload)
    },

    // User methods
    /** Gets the current authenticated user. */
    async getUser(): Promise<unknown> {
      return request('GET', USER_API_PATH)
    },

    /** Updates the current user's information. */
    async updateUser(payload: Record<string, unknown>): Promise<unknown> {
      return request('PUT', USER_API_PATH, payload)
    },

    /** Signs out the current user. */
    async signOut(): Promise<unknown> {
      return request('POST', LOGOUT_API_PATH)
    },

    /** Invites a new user by email. */
    async inviteUser(email: string): Promise<unknown> {
      const payload = { email }
      return request('POST', INVITE_API_PATH, payload)
    },

    /** Resets a user's password using a reset token. */
    async resetPassword(
      tokenValue: string,
      newPassword: string
    ): Promise<unknown> {
      const payload = { token: tokenValue, password: newPassword }
      const path = `${RESET_API_PATH}?grant_type=reset_password`
      return request('POST', path, payload)
    },

    // REST methods
    /** Performs a GET request to fetch data. */
    async get(endpoint: string, queryParams?: QueryParams): Promise<unknown> {
      if (queryParams) {
        return request('GET', endpoint, undefined, queryParams)
      }
      return request('GET', endpoint)
    },

    /** Performs a POST request to create data. */
    async post(endpoint: string, data: unknown): Promise<unknown> {
      return request('POST', endpoint, data)
    },

    /** Performs a PUT request to replace a record. */
    async put(
      endpoint: string,
      primaryKeyName: string,
      primaryKeyValue: string,
      data: unknown
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return request('PUT', endpoint, data, queryParams)
    },

    /** Performs a PATCH request to update records. */
    async patch(
      endpoint: string,
      queryParams: QueryParams,
      data: unknown
    ): Promise<unknown> {
      return request('PATCH', endpoint, data, queryParams)
    },

    /** Performs a DELETE request to remove a record. */
    async del(
      endpoint: string,
      primaryKeyName: string,
      primaryKeyValue: string
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return request('DELETE', endpoint, queryParams)
    },

    /** Alias for the REST delete method. */
    get delete() {
      return this.del
    },

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
    ERROR_MESSAGES
  }
}
