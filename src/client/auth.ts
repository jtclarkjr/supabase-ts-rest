import {
  AuthTokenResponse,
  TokenRequestPayload,
  MagicLinkPayload,
  VerifyOTPPayload,
  DoRequestFn,
  AuthRequestFn
} from '../types'
import {
  TOKEN_API_PATH,
  SIGNUP_API_PATH,
  MAGIC_LINK_API_PATH,
  RECOVER_API_PATH,
  VERIFY_API_PATH
} from '../utils/constants'

/**
 * Creates authentication-related methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @param authRequest - Auth-specific request function
 * @returns An object with authentication methods
 */
export function createAuthMethods(
  doRequest: DoRequestFn,
  authRequest: AuthRequestFn
) {
  return {
    /**
     * Registers a new user with email and password.
     * @param email - User's email address
     * @param password - User's password
     * @returns The API response
     */
    async signUp(email: string, password: string): Promise<unknown> {
      const payload = { email, password }
      const path = `${SIGNUP_API_PATH}?grant_type=signup`
      return doRequest('POST', path, payload)
    },

    /**
     * Signs in a user with email and password.
     * @param email - User's email address
     * @param password - User's password
     * @returns The authentication token response
     */
    async signIn(email: string, password: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { email, password }
      const path = `${TOKEN_API_PATH}?grant_type=password`
      return authRequest(path, payload)
    },

    /**
     * Refreshes the authentication token using a refresh token.
     * @param refreshTokenValue - The refresh token
     * @returns The authentication token response
     */
    async refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { refresh_token: refreshTokenValue }
      const path = `${TOKEN_API_PATH}?grant_type=refresh_token`
      return authRequest(path, payload)
    },

    /**
     * Sends a magic link to the user's email for passwordless sign-in.
     * @param email - User's email address
     * @returns The API response
     */
    async sendMagicLink(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return doRequest('POST', MAGIC_LINK_API_PATH, payload)
    },

    /**
     * Sends a password recovery email to the user.
     * @param email - User's email address
     * @returns The API response
     */
    async sendPasswordRecovery(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return doRequest('POST', RECOVER_API_PATH, payload)
    },

    /**
     * Verifies a one-time password (OTP) for email or phone.
     * @param email - User's email address
     * @param tokenValue - The OTP token
     * @param otpType - The type of OTP (e.g., 'email', 'sms')
     * @returns The API response
     */
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
      return doRequest('POST', VERIFY_API_PATH, payload)
    }
  }
}
