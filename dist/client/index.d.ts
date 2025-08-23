import { ClientConfig, AuthTokenResponse, TokenRequestPayload, QueryParams, HttpMethod } from '../types';
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 */
export declare function createSupabaseClient(config: ClientConfig): {
    baseUrl: string;
    apiKey: string;
    readonly token: string | undefined;
    /** Sets the authentication token. */
    setToken: (newToken: string) => void;
    /** Gets the current authentication token. */
    getToken: () => string | undefined;
    /** Core HTTP request method. */
    request: (method: HttpMethod, endpoint: string, body?: unknown, queryParams?: QueryParams) => Promise<unknown>;
    /** Auth request method. */
    auth: (endpoint: string, payload: TokenRequestPayload) => Promise<AuthTokenResponse>;
    /** Registers a new user with email and password. */
    signUp(email: string, password: string): Promise<unknown>;
    /** Signs in a user with email and password. */
    signIn(email: string, password: string): Promise<AuthTokenResponse>;
    /** Refreshes the authentication token. */
    refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse>;
    /** Sends a magic link for passwordless sign-in. */
    sendMagicLink(email: string): Promise<unknown>;
    /** Sends a password recovery email. */
    sendPasswordRecovery(email: string): Promise<unknown>;
    /** Verifies an OTP code. */
    verifyOTP(email: string, tokenValue: string, otpType: string): Promise<unknown>;
    /** Gets the current authenticated user. */
    getUser(): Promise<unknown>;
    /** Updates the current user's information. */
    updateUser(payload: Record<string, unknown>): Promise<unknown>;
    /** Signs out the current user. */
    signOut(): Promise<unknown>;
    /** Invites a new user by email. */
    inviteUser(email: string): Promise<unknown>;
    /** Resets a user's password using a reset token. */
    resetPassword(tokenValue: string, newPassword: string): Promise<unknown>;
    /** Performs a GET request to fetch data. */
    get(endpoint: string, queryParams?: QueryParams): Promise<unknown>;
    /** Performs a POST request to create data. */
    post(endpoint: string, data: unknown): Promise<unknown>;
    /** Performs a PUT request to replace a record. */
    put(endpoint: string, primaryKeyName: string, primaryKeyValue: string, data: unknown): Promise<unknown>;
    /** Performs a PATCH request to update records. */
    patch(endpoint: string, queryParams: QueryParams, data: unknown): Promise<unknown>;
    /** Performs a DELETE request to remove a record. */
    del(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>;
    /** Alias for the REST delete method. */
    readonly delete: (endpoint: string, primaryKeyName: string, primaryKeyValue: string) => Promise<unknown>;
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
};
//# sourceMappingURL=index.d.ts.map