/**
 * Supabase REST Client for TypeScript/Node.js
 *
 * A lightweight, flexible TypeScript client designed to simplify interactions
 * with Supabase's REST API, providing a seamless middleware solution for
 * handling authenticated requests and Row Level Security (RLS) integrations.
 */
import { createSupabaseClient } from './client/index';
export * from './types';
export * from './utils/constants';
export { createSupabaseClient };
// Convenience function to create a new client
export function createClient(baseUrl, apiKey, token) {
    return createSupabaseClient({ baseUrl, apiKey, token });
}
//# sourceMappingURL=index.js.map