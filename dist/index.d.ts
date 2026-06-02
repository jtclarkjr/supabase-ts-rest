//#region src/client/index.d.ts
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 */
declare function createSupabaseClient(config: ClientConfig): {
  baseUrl: string;
  apiKey: string;
  readonly token: string | undefined; /** Sets the authentication token. */
  setToken: (newToken: string) => void; /** Gets the current authentication token. */
  getToken: () => string | undefined; /** Core HTTP request method. */
  request: (method: HttpMethod, endpoint: string, body?: unknown, queryParams?: QueryParams) => Promise<unknown>; /** Auth request method. */
  auth: (endpoint: string, payload: TokenRequestPayload) => Promise<AuthTokenResponse>; /** Registers a new user with email and password. */
  signUp(email: string, password: string, options?: SignUpOptions): Promise<AuthSignUpResponse>; /** Starts an anonymous authenticated session. */
  signInAnonymously(options?: AnonymousSignInOptions): Promise<AuthSessionResponse>; /** Signs in a user with email and password. */
  signIn(email: string, password: string): Promise<AuthTokenResponse>; /** Refreshes the authentication token. */
  refreshToken(refreshTokenValue: string): Promise<AuthTokenResponse>; /** Exchanges an OAuth authorization code for a session token pair. */
  exchangeCodeForSession(authCode: string, codeVerifier: string): Promise<AuthTokenResponse>; /** Sends a magic link for passwordless sign-in. */
  sendMagicLink(email: string): Promise<unknown>; /** Sends a password recovery email. */
  sendPasswordRecovery(email: string): Promise<unknown>; /** Verifies an OTP code. */
  verifyOTP(email: string, tokenValue: string, otpType: string): Promise<unknown>; /** Builds an OAuth authorize URL for a provider. */
  getOAuthSignInUrl(provider: OAuthProvider, options?: OAuthSignInOptions): OAuthSignInResponse; /** Gets the current authenticated user. */
  getUser(): Promise<unknown>; /** Updates the current user's information. */
  updateUser(payload: Record<string, unknown>): Promise<unknown>; /** Signs out the current user. */
  signOut(scope?: "global" | "local" | "others"): Promise<unknown>; /** Invites a new user by email. */
  inviteUser(email: string): Promise<unknown>; /** Resets a user's password using a reset token. */
  resetPassword(tokenValue: string, newPassword: string): Promise<unknown>; /** Performs a GET request to fetch data. */
  get(endpoint: string, queryParams?: QueryParams): Promise<unknown>; /** Performs a POST request to create data. */
  post(endpoint: string, data: unknown): Promise<unknown>; /** Performs a PUT request to replace a record. */
  put(endpoint: string, primaryKeyName: string, primaryKeyValue: string, data: unknown): Promise<unknown>; /** Performs a PATCH request to update records. */
  patch(endpoint: string, queryParams: QueryParams, data: unknown): Promise<unknown>; /** Performs a DELETE request to remove a record. */
  del(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>; /** Alias for the REST delete method. */
  delete(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>;
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
//#endregion
//#region src/types/index.d.ts
type SupabaseClient = ReturnType<typeof createSupabaseClient>;
/**
 * Type definitions for Supabase REST client
 */
/**
 * The format of a Supabase API key.
 *
 * - `publishable` — new `sb_publishable_...` key. Client-safe. Replaces the legacy anon key.
 * - `secret` — new `sb_secret_...` key. Server-only. Replaces the legacy service_role key.
 * - `legacy` — legacy JWT-format anon or service_role key. Still supported by Supabase.
 */
type KeyType = 'publishable' | 'secret' | 'legacy';
/**
 * Configuration options for the Supabase client.
 */
interface ClientConfig {
  /** Your Supabase project URL (e.g., `https://your-project.supabase.co`). */
  baseUrl: string;
  /**
   * A Supabase API key. Accepts any of:
   * - `sb_publishable_...` (new, client-safe, recommended for browsers)
   * - `sb_secret_...` (new, server-only)
   * - a legacy JWT-format anon or service_role key (still supported)
   */
  apiKey: string;
  /** Optional JWT access token for authenticated requests. */
  token?: string;
}
interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  identities?: unknown[];
  is_anonymous?: boolean;
  [key: string]: unknown;
}
/**
 * Response from authentication token endpoint
 */
interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at?: number;
}
interface AuthSessionResponse extends AuthTokenResponse {
  user: AuthUser;
}
type AuthSignUpResponse = AuthSessionResponse | AuthUser | {
  user: AuthUser;
  session: AuthSessionResponse | null;
};
/**
 * Payload for token requests
 */
interface TokenRequestPayload {
  email?: string;
  password?: string;
  refresh_token?: string;
  auth_code?: string;
  grant_type?: string;
  data?: Record<string, unknown>;
  gotrue_meta_security?: Record<string, unknown>;
  code_challenge?: string | null;
  code_challenge_method?: string | null;
  code_verifier?: string | null;
}
interface SignUpOptions {
  data?: Record<string, unknown>;
  captchaToken?: string;
  redirectTo?: string;
}
interface AnonymousSignInOptions {
  data?: Record<string, unknown>;
}
type OAuthProvider = 'apple' | 'azure' | 'bitbucket' | 'discord' | 'facebook' | 'figma' | 'github' | 'gitlab' | 'google' | 'kakao' | 'keycloak' | 'linkedin_oidc' | 'notion' | 'twitch' | 'twitter' | 'slack_oidc' | 'slack' | 'spotify' | 'workos' | 'zoom';
interface OAuthSignInOptions {
  redirectTo?: string;
  scopes?: string;
  queryParams?: QueryParams;
}
interface OAuthSignInResponse {
  provider: OAuthProvider;
  url: string;
}
/**
 * Payload for magic link requests
 */
interface MagicLinkPayload {
  email: string;
}
/**
 * Payload for OTP verification
 */
interface VerifyOTPPayload {
  email: string;
  token: string;
  type: string;
}
/**
 * Generic query parameters object
 */
interface QueryParams {
  [key: string]: string | undefined;
}
/**
 * HTTP method types
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/**
 * Function types for client methods
 */
type DoRequestFn = (method: HttpMethod, endpoint: string, body?: unknown, queryParams?: QueryParams) => Promise<unknown>;
type AuthRequestFn = (endpoint: string, payload: TokenRequestPayload) => Promise<AuthTokenResponse>;
/**
 * Request configuration
 */
interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  queryParams?: QueryParams;
  body?: unknown;
}
/**
 * Custom error class for Supabase client errors
 */
declare class SupabaseError extends Error {
  statusCode?: number | undefined;
  response?: unknown | undefined;
  constructor(message: string, statusCode?: number | undefined, response?: unknown | undefined);
}
//#endregion
//#region src/utils/constants/index.d.ts
/**
 * Constants for Supabase API paths and configuration
 */
declare const REST_API_PATH = "/rest/v1";
declare const AUTH_API_PATH = "/auth/v1";
declare const TOKEN_API_PATH = "/auth/v1/token";
declare const SIGNUP_API_PATH = "/auth/v1/signup";
declare const MAGIC_LINK_API_PATH = "/auth/v1/magiclink";
declare const RECOVER_API_PATH = "/auth/v1/recover";
declare const VERIFY_API_PATH = "/auth/v1/verify";
declare const USER_API_PATH = "/auth/v1/user";
declare const LOGOUT_API_PATH = "/auth/v1/logout";
declare const INVITE_API_PATH = "/auth/v1/invite";
declare const RESET_API_PATH = "/auth/v1/reset";
declare const ERROR_MESSAGES: {
  readonly INVALID_RESPONSE: "Invalid response from server";
  readonly REQUEST_FAILED: "Request failed";
  readonly INVALID_CONFIG: "Invalid client configuration";
  readonly NETWORK_ERROR: "Network error occurred";
  readonly PARSE_ERROR: "Failed to parse response";
};
//#endregion
//#region src/utils/keys/index.d.ts
/**
 * Detects the format of a Supabase API key by its prefix.
 *
 * Useful for guarding server-only code paths (never ship a `secret` key
 * to the browser) or for logging and telemetry.
 *
 * @param apiKey - The Supabase API key to inspect.
 * @returns `'publishable'`, `'secret'`, or `'legacy'`.
 *
 * @example
 * ```typescript
 * detectKeyType('sb_publishable_abc123') // 'publishable'
 * detectKeyType('sb_secret_xyz789')      // 'secret'
 * detectKeyType('eyJhbGciOi...')         // 'legacy'
 * ```
 */
declare function detectKeyType(apiKey: string): KeyType;
//#endregion
//#region src/index.d.ts
/**
 * Creates a new Supabase REST client instance with authentication support.
 *
 * This client provides a simplified interface for interacting with Supabase's REST API,
 * including authentication, user management, and database operations with automatic
 * Row Level Security (RLS) token handling.
 *
 * @param baseUrl - Your Supabase project URL (e.g., "https://your-project.supabase.co")
 * @param apiKey - Your Supabase API key. Accepts `sb_publishable_...` (recommended for
 *   browsers), `sb_secret_...` (server only), or a legacy anon/service_role key.
 * @param token - Optional JWT token for authenticated requests
 * @returns A SupabaseClient instance with methods for auth, user management, and REST operations
 *
 * @example
 * ```typescript
 * import { createClient } from '@jtclarkjr/supabase-ts-rest';
 *
 * const client = createClient(
 *   'https://your-project.supabase.co',
 *   'sb_publishable_your-key-here'
 * );
 *
 * // Authenticate user
 * const auth = await client.signIn('user@example.com', 'password');
 * client.setToken(auth.access_token);
 *
 * // Perform database operations
 * const users = await client.get('users');
 * const newUser = await client.post('users', { name: 'John', email: 'john@example.com' });
 * ```
 *
 * @example
 * ```typescript
 * // Environment-based configuration.
 * // Legacy SUPABASE_ANON_KEY is still supported with no code changes.
 * const client = createClient(
 *   process.env.SUPABASE_URL!,
 *   process.env.SUPABASE_PUBLISHABLE_KEY!
 * );
 *
 * // Magic link authentication
 * await client.sendMagicLink('user@example.com');
 *
 * // Get authenticated user
 * const user = await client.getUser();
 * console.log(user.email); // "user@example.com"
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with error handling
 * try {
 *   const client = createClient(baseUrl, apiKey);
 *
 *   // Query with filters
 *   const activeUsers = await client.get('users', { status: 'active' });
 *
 *   // Update with conditions
 *   const updated = await client.patch('users', { id: '123' }, {
 *     last_seen: new Date().toISOString()
 *   });
 * } catch (error) {
 *   if (error instanceof SupabaseError) {
 *     console.error('API Error:', error.message, error.statusCode);
 *   }
 * }
 * ```
 */
declare function createClient(baseUrl: string, apiKey: string, token?: string): SupabaseClient;
//#endregion
export { AUTH_API_PATH, AnonymousSignInOptions, AuthRequestFn, AuthSessionResponse, AuthSignUpResponse, AuthTokenResponse, AuthUser, ClientConfig, DoRequestFn, ERROR_MESSAGES, HttpMethod, INVITE_API_PATH, KeyType, LOGOUT_API_PATH, MAGIC_LINK_API_PATH, MagicLinkPayload, OAuthProvider, OAuthSignInOptions, OAuthSignInResponse, QueryParams, RECOVER_API_PATH, RESET_API_PATH, REST_API_PATH, RequestConfig, SIGNUP_API_PATH, SignUpOptions, SupabaseClient, SupabaseError, TOKEN_API_PATH, TokenRequestPayload, USER_API_PATH, VERIFY_API_PATH, VerifyOTPPayload, createClient, createSupabaseClient, detectKeyType };
//# sourceMappingURL=index.d.ts.map