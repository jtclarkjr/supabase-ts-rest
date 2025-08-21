/**
 * Supabase REST Client for TypeScript/Node.js
 *
 * A lightweight, flexible TypeScript client designed to simplify interactions
 * with Supabase's REST API, providing a seamless middleware solution for
 * handling authenticated requests and Row Level Security (RLS) integrations.
 */

import type { SupabaseClient } from './types'
import { createSupabaseClient } from './client/index'

export * from './types'
export * from './utils/constants'
export { createSupabaseClient }
export type { SupabaseClient } from './types'

/**
 * Creates a new Supabase REST client instance with authentication support.
 * 
 * This client provides a simplified interface for interacting with Supabase's REST API,
 * including authentication, user management, and database operations with automatic
 * Row Level Security (RLS) token handling.
 * 
 * @param baseUrl - Your Supabase project URL (e.g., "https://your-project.supabase.co")
 * @param apiKey - Your Supabase anon/public API key
 * @param token - Optional JWT token for authenticated requests
 * @returns A SupabaseClient instance with methods for auth, user management, and REST operations
 * 
 * @example
 * ```typescript
 * import { createClient } from '@jtclarkjr/supabase-ts-rest';
 * 
 * const client = createClient(
 *   'https://your-project.supabase.co',
 *   'your-supabase-anon-key'
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
 * // Environment-based configuration
 * const client = createClient(
 *   process.env.SUPABASE_URL!,
 *   process.env.SUPABASE_ANON_KEY!
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
export function createClient(
  baseUrl: string,
  apiKey: string,
  token?: string
): SupabaseClient {
  return createSupabaseClient({ baseUrl, apiKey, token })
}
