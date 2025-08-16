/**
 * Type definitions for Supabase REST client
 */
/**
 * Custom error class for Supabase client errors
 */
export class SupabaseError extends Error {
    statusCode;
    response;
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'SupabaseError';
    }
}
//# sourceMappingURL=index.js.map