import type { createSupabaseClient } from '../client/index.js'
export type SupabaseClient = ReturnType<typeof createSupabaseClient>
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
export type KeyType = 'publishable' | 'secret' | 'legacy'

/**
 * Configuration options for the Supabase client.
 */
export interface ClientConfig {
  /** Your Supabase project URL (e.g., `https://your-project.supabase.co`). */
  baseUrl: string
  /**
   * A Supabase API key. Accepts any of:
   * - `sb_publishable_...` (new, client-safe, recommended for browsers)
   * - `sb_secret_...` (new, server-only)
   * - a legacy JWT-format anon or service_role key (still supported)
   */
  apiKey: string
  /** Optional JWT access token for authenticated requests. */
  token?: string
}

export interface AuthUser {
  id: string
  email?: string
  phone?: string
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
  identities?: unknown[]
  is_anonymous?: boolean
  [key: string]: unknown
}

/**
 * Response from authentication token endpoint
 */
export interface AuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  expires_at?: number
}

export interface AuthSessionResponse extends AuthTokenResponse {
  user: AuthUser
}

/**
 * Payload for token requests
 */
export interface TokenRequestPayload {
  email?: string
  password?: string
  refresh_token?: string
  auth_code?: string
  grant_type?: string
  data?: Record<string, unknown>
  gotrue_meta_security?: Record<string, unknown>
  code_challenge?: string | null
  code_challenge_method?: string | null
  code_verifier?: string | null
}

export interface SignUpOptions {
  data?: Record<string, unknown>
}

export interface AnonymousSignInOptions {
  data?: Record<string, unknown>
}

export type OAuthProvider = 'github' | 'google' | 'apple'

export interface OAuthSignInOptions {
  redirectTo?: string
  scopes?: string
  queryParams?: QueryParams
}

export interface OAuthSignInResponse {
  provider: OAuthProvider
  url: string
}

/**
 * Payload for magic link requests
 */
export interface MagicLinkPayload {
  email: string
}

/**
 * Payload for OTP verification
 */
export interface VerifyOTPPayload {
  email: string
  token: string
  type: string
}

/**
 * Generic query parameters object
 */
export interface QueryParams {
  [key: string]: string | undefined
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Function types for client methods
 */
export type DoRequestFn = (
  method: HttpMethod,
  endpoint: string,
  body?: unknown,
  queryParams?: QueryParams
) => Promise<unknown>

export type AuthRequestFn = (
  endpoint: string,
  payload: TokenRequestPayload
) => Promise<AuthTokenResponse>

/**
 * Request configuration
 */
export interface RequestConfig {
  method: HttpMethod
  endpoint: string
  queryParams?: QueryParams
  body?: unknown
}

/**
 * Custom error class for Supabase client errors
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}
