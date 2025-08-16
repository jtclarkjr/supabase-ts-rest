/**
 * Type definitions for Supabase REST client
 */
/**
 * Configuration options for the Supabase client
 */
export interface ClientConfig {
    baseUrl: string;
    apiKey: string;
    token?: string;
}
/**
 * Response from authentication token endpoint
 */
export interface AuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
}
/**
 * Payload for token requests
 */
export interface TokenRequestPayload {
    email?: string;
    password?: string;
    refresh_token?: string;
    grant_type?: string;
}
/**
 * Payload for magic link requests
 */
export interface MagicLinkPayload {
    email: string;
}
/**
 * Payload for OTP verification
 */
export interface VerifyOTPPayload {
    email: string;
    token: string;
    type: string;
}
/**
 * Generic query parameters object
 */
export interface QueryParams {
    [key: string]: string;
}
/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/**
 * Function types for client methods
 */
export type DoRequestFn = (method: HttpMethod, endpoint: string, queryParams?: QueryParams, body?: unknown) => Promise<unknown>;
export type AuthRequestFn = (endpoint: string, payload: TokenRequestPayload) => Promise<AuthTokenResponse>;
/**
 * Request configuration
 */
export interface RequestConfig {
    method: HttpMethod;
    endpoint: string;
    queryParams?: QueryParams;
    body?: unknown;
}
/**
 * Custom error class for Supabase client errors
 */
export declare class SupabaseError extends Error {
    statusCode?: number | undefined;
    response?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, response?: unknown | undefined);
}
//# sourceMappingURL=index.d.ts.map