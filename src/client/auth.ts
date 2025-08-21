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
     * 
     * Creates a new user account in Supabase Auth using email and password.
     * The user will need to confirm their email before they can sign in
     * (depending on your Supabase project settings).
     * 
     * @param email - User's email address
     * @param password - User's password (minimum 6 characters)
     * @returns Promise resolving to the signup response with user data
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * const result = await client.signUp('user@example.com', 'password123');
     * console.log('User created:', result);
     * ```
     * 
     * @example
     * ```typescript
     * // With error handling
     * try {
     *   const result = await client.signUp('newuser@example.com', 'securepass');
     *   console.log('Signup successful:', result.user?.email);
     * } catch (error) {
     *   console.error('Signup failed:', error.message);
     * }
     * ```
     */
    async signUp(email: string, password: string): Promise<unknown> {
      const payload = { email, password }
      const path = `${SIGNUP_API_PATH}?grant_type=signup`
      return doRequest('POST', path, payload)
    },

    /**
     * Signs in a user with email and password.
     * 
     * Authenticates an existing user and returns access and refresh tokens.
     * The access token should be used for subsequent authenticated requests.
     * 
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise resolving to authentication response with tokens
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * const auth = await client.signIn('user@example.com', 'password123');
     * console.log('Access token:', auth.access_token);
     * 
     * // Set token for authenticated requests
     * client.setToken(auth.access_token);
     * ```
     * 
     * @example
     * ```typescript
     * // Sign in and immediately use for API calls
     * const auth = await client.signIn('admin@company.com', 'adminpass');
     * client.setToken(auth.access_token);
     * 
     * const userData = await client.getUser();
     * console.log('Logged in as:', userData.email);
     * ```
     */
    async signIn(email: string, password: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { email, password }
      const path = `${TOKEN_API_PATH}?grant_type=password`
      return authRequest(path, payload)
    },

    /**
     * Refreshes the authentication token using a refresh token.
     * 
     * When an access token expires, use the refresh token to get a new
     * access token without requiring the user to sign in again.
     * 
     * @param refreshTokenValue - The refresh token from a previous authentication
     * @returns Promise resolving to new authentication response with fresh tokens
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Initial sign in
     * const auth = await client.signIn('user@example.com', 'password');
     * 
     * // Later, when token expires
     * const newAuth = await client.refreshToken(auth.refresh_token);
     * client.setToken(newAuth.access_token);
     * ```
     * 
     * @example
     * ```typescript
     * // Automatic token refresh in a long-running app
     * let currentAuth = await client.signIn('user@example.com', 'password');
     * 
     * setInterval(async () => {
     *   try {
     *     currentAuth = await client.refreshToken(currentAuth.refresh_token);
     *     client.setToken(currentAuth.access_token);
     *     console.log('Token refreshed successfully');
     *   } catch (error) {
     *     console.error('Token refresh failed, user needs to sign in again');
     *   }
     * }, 3600000); // Refresh every hour
     * ```
     */
    async refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse> {
      const payload: TokenRequestPayload = { refresh_token: refreshTokenValue }
      const path = `${TOKEN_API_PATH}?grant_type=refresh_token`
      return authRequest(path, payload)
    },

    /**
     * Sends a magic link to the user's email for passwordless sign-in.
     * 
     * Sends an email with a secure link that allows users to sign in
     * without entering a password. The link expires after a set time.
     * 
     * @param email - User's email address
     * @returns Promise resolving to the magic link send response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * await client.sendMagicLink('user@example.com');
     * console.log('Magic link sent! Check your email.');
     * ```
     * 
     * @example
     * ```typescript
     * // Send magic link with user feedback
     * try {
     *   await client.sendMagicLink('customer@example.com');
     *   alert('Please check your email for a sign-in link');
     * } catch (error) {
     *   alert('Failed to send magic link: ' + error.message);
     * }
     * ```
     */
    async sendMagicLink(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return doRequest('POST', MAGIC_LINK_API_PATH, payload)
    },

    /**
     * Sends a password recovery email to the user.
     * 
     * Sends an email with instructions and a secure link to reset
     * the user's password. The reset link expires after a set time.
     * 
     * @param email - User's email address
     * @returns Promise resolving to the password recovery send response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * await client.sendPasswordRecovery('user@example.com');
     * console.log('Password recovery email sent');
     * ```
     * 
     * @example
     * ```typescript
     * // Password recovery with validation
     * const email = 'forgotful@example.com';
     * 
     * if (email.includes('@')) {
     *   await client.sendPasswordRecovery(email);
     *   console.log(`Recovery instructions sent to ${email}`);
     * } else {
     *   console.error('Please enter a valid email address');
     * }
     * ```
     */
    async sendPasswordRecovery(email: string): Promise<unknown> {
      const payload: MagicLinkPayload = { email }
      return doRequest('POST', RECOVER_API_PATH, payload)
    },

    /**
     * Verifies a one-time password (OTP) for email or phone.
     * 
     * Validates an OTP code sent via email or SMS. Used for confirming
     * user accounts, password resets, or two-factor authentication.
     * 
     * @param email - User's email address
     * @param tokenValue - The OTP code (usually 6 digits)
     * @param otpType - The type of OTP verification ('signup', 'recovery', 'email_change', etc.)
     * @returns Promise resolving to the verification response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Verify email after signup
     * const result = await client.verifyOTP(
     *   'user@example.com',
     *   '123456',
     *   'signup'
     * );
     * console.log('Email verified:', result);
     * ```
     * 
     * @example
     * ```typescript
     * // Verify OTP for password recovery
     * const otpCode = '654321';
     * const userEmail = 'user@example.com';
     * 
     * try {
     *   await client.verifyOTP(userEmail, otpCode, 'recovery');
     *   console.log('OTP verified, you can now reset your password');
     * } catch (error) {
     *   console.error('Invalid or expired OTP code');
     * }
     * ```
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
