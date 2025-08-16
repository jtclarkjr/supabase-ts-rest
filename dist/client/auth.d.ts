import { AuthTokenResponse, DoRequestFn, AuthRequestFn } from '../types';
/**
 * Creates authentication-related methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @param authRequest - Auth-specific request function
 * @returns An object with authentication methods
 */
export declare function createAuthMethods(doRequest: DoRequestFn, authRequest: AuthRequestFn): {
    /**
     * Registers a new user with email and password.
     * @param email - User's email address
     * @param password - User's password
     * @returns The API response
     */
    signUp(email: string, password: string): Promise<unknown>;
    /**
     * Signs in a user with email and password.
     * @param email - User's email address
     * @param password - User's password
     * @returns The authentication token response
     */
    signIn(email: string, password: string): Promise<AuthTokenResponse>;
    /**
     * Refreshes the authentication token using a refresh token.
     * @param refreshTokenValue - The refresh token
     * @returns The authentication token response
     */
    refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse>;
    /**
     * Sends a magic link to the user's email for passwordless sign-in.
     * @param email - User's email address
     * @returns The API response
     */
    sendMagicLink(email: string): Promise<unknown>;
    /**
     * Sends a password recovery email to the user.
     * @param email - User's email address
     * @returns The API response
     */
    sendPasswordRecovery(email: string): Promise<unknown>;
    /**
     * Verifies a one-time password (OTP) for email or phone.
     * @param email - User's email address
     * @param tokenValue - The OTP token
     * @param otpType - The type of OTP (e.g., 'email', 'sms')
     * @returns The API response
     */
    verifyOTP(email: string, tokenValue: string, otpType: string): Promise<unknown>;
};
//# sourceMappingURL=auth.d.ts.map