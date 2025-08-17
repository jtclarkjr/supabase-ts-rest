"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseError = void 0;
/**
 * Custom error class for Supabase client errors
 */
class SupabaseError extends Error {
    statusCode;
    response;
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'SupabaseError';
    }
}
exports.SupabaseError = SupabaseError;
//# sourceMappingURL=index.js.map