import { ClientConfig, AuthTokenResponse, TokenRequestPayload, QueryParams, HttpMethod } from '../types';
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 * @param config - The client configuration object containing baseUrl, apiKey, and optional token.
 * @returns A Supabase client object with methods for authentication, user management, and REST operations.
 */
export declare function createSupabaseClient(config: ClientConfig): {
    /**
     * Alias for the REST delete method (since 'delete' is a reserved word).
     */
    delete: (endpoint: string, primaryKeyName: string, primaryKeyValue: string) => Promise<unknown>;
    TOKEN_API_PATH: string;
    SIGNUP_API_PATH: string;
    MAGIC_LINK_API_PATH: string;
    RECOVER_API_PATH: string;
    VERIFY_API_PATH: string;
    USER_API_PATH: string;
    LOGOUT_API_PATH: string;
    INVITE_API_PATH: string;
    RESET_API_PATH: string;
    ERROR_MESSAGES: {
        readonly INVALID_RESPONSE: "Invalid response from server";
        readonly REQUEST_FAILED: "Request failed";
        readonly INVALID_CONFIG: "Invalid client configuration";
        readonly NETWORK_ERROR: "Network error occurred";
        readonly PARSE_ERROR: "Failed to parse response";
    };
    get(endpoint: string, queryParams?: QueryParams): Promise<unknown>;
    post(endpoint: string, data: unknown): Promise<unknown>;
    put(endpoint: string, primaryKeyName: string, data: unknown, primaryKeyValue: string): Promise<unknown>;
    patch(endpoint: string, data: unknown, queryParams: QueryParams): Promise<unknown>;
    del(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>;
    getUser(): Promise<unknown>;
    updateUser(payload: Record<string, unknown>): Promise<unknown>;
    signOut(): Promise<unknown>;
    inviteUser(email: string): Promise<unknown>;
    resetPassword(tokenValue: string, newPassword: string): Promise<unknown>;
    signUp(email: string, password: string): Promise<unknown>;
    signIn(email: string, password: string): Promise<AuthTokenResponse>;
    refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse>;
    sendMagicLink(email: string): Promise<unknown>;
    sendPasswordRecovery(email: string): Promise<unknown>;
    verifyOTP(email: string, tokenValue: string, otpType: string): Promise<unknown>;
    baseUrl: string;
    apiKey: string;
    token: string | undefined;
    /**
     * Sets the current authentication token for the client.
     * @param newToken - The new token to use for requests
     */
    setToken: (newToken: string) => void;
    /**
     * Gets the current authentication token used by the client.
     * @returns The current token string
     */
    getToken: () => string | undefined;
    /**
     * Exposes the core HTTP request method for advanced usage.
     */
    doRequest: (method: HttpMethod, endpoint: string, body?: unknown, queryParams?: QueryParams) => Promise<unknown>;
    /**
     * Exposes the auth-specific request method for advanced usage.
     */
    authRequest: (endpoint: string, payload: TokenRequestPayload) => Promise<AuthTokenResponse>;
};
//# sourceMappingURL=index.d.ts.map