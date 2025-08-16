"use strict";
/**
 * Type definitions for Supabase REST client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseError = void 0;
/**
 * Custom error class for Supabase client errors
 */
class SupabaseError extends Error {
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'SupabaseError';
    }
}
exports.SupabaseError = SupabaseError;
//# sourceMappingURL=types.js.map