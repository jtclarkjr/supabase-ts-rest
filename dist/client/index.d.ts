import { ClientConfig } from '../types';
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 * @param config - The client configuration object containing baseUrl, apiKey, and optional token.
 * @returns A Supabase client object with methods for authentication, user management, and REST operations.
 */
export declare function createSupabaseClient(config: ClientConfig): any;
export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
//# sourceMappingURL=index.d.ts.map