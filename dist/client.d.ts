import { ClientConfig, AuthTokenResponse, QueryParams } from './types';
/**
 * Supabase REST client for TypeScript/Node.js
 */
export declare class SupabaseClient {
    private baseUrl;
    private apiKey;
    private token?;
    /**
     * Creates a new Supabase client instance
     */
    constructor(config: ClientConfig);
    /**
     * Updates the authentication token
     */
    setToken(token: string): void;
    /**
     * Gets the current authentication token
     */
    getToken(): string | undefined;
    /**
     * Creates a new user account
     */
    signUp(email: string, password: string): Promise<unknown>;
    /**
     * Authenticates a user and retrieves a token
     */
    signIn(email: string, password: string): Promise<AuthTokenResponse>;
    /**
     * Refreshes the access token using a refresh token
     */
    refreshToken(refreshToken: string): Promise<AuthTokenResponse>;
    /**
     * Sends a magic link to the user's email
     */
    sendMagicLink(email: string): Promise<unknown>;
    /**
     * Sends a password recovery email
     */
    sendPasswordRecovery(email: string): Promise<unknown>;
    /**
     * Verifies a one-time password (OTP)
     */
    verifyOTP(email: string, token: string, otpType: string): Promise<unknown>;
    /**
     * Retrieves the authenticated user's information
     */
    getUser(): Promise<unknown>;
    /**
     * Updates the authenticated user's information
     */
    updateUser(payload: Record<string, unknown>): Promise<unknown>;
    /**
     * Signs out the current user
     */
    signOut(): Promise<unknown>;
    /**
     * Invites a new user (admin only)
     */
    inviteUser(email: string): Promise<unknown>;
    /**
     * Resets a user's password using a token
     */
    resetPassword(token: string, newPassword: string): Promise<unknown>;
    /**
     * Performs a GET request to the Supabase REST API
     */
    get(endpoint: string, queryParams?: QueryParams): Promise<unknown>;
    /**
     * Performs a POST request to the Supabase REST API
     */
    post(endpoint: string, data: unknown): Promise<unknown>;
    /**
     * Performs a PUT request to the Supabase REST API
     */
    put(endpoint: string, primaryKeyName: string, primaryKeyValue: string, data: unknown): Promise<unknown>;
    /**
     * Performs a PATCH request to the Supabase REST API
     */
    patch(endpoint: string, queryParams: QueryParams, data: unknown): Promise<unknown>;
    /**
     * Performs a DELETE request to the Supabase REST API
     */
    delete(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>;
    /**
     * Formats query parameters for Supabase compatibility
     */
    private formatQueryParams;
    /**
     * Handles authentication-related requests
     */
    private authRequest;
    /**
     * Performs the actual HTTP request
     */
    private doRequest;
}
//# sourceMappingURL=client.d.ts.map