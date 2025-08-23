"use strict";
/**
 * Supabase REST Client for TypeScript/Node.js
 *
 * A lightweight, flexible TypeScript client designed to simplify interactions
 * with Supabase's REST API, providing a seamless middleware solution for
 * handling authenticated requests and Row Level Security (RLS) integrations.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = void 0;
exports.createClient = createClient;
const index_1 = require("./client/index");
Object.defineProperty(exports, "createSupabaseClient", { enumerable: true, get: function () { return index_1.createSupabaseClient; } });
__exportStar(require("./types"), exports);
__exportStar(require("./utils/constants"), exports);
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
function createClient(baseUrl, apiKey, token) {
    return (0, index_1.createSupabaseClient)({ baseUrl, apiKey, token });
}
//# sourceMappingURL=index.js.map