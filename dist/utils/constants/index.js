"use strict";
/**
 * Constants for Supabase API paths and configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.RESET_API_PATH = exports.INVITE_API_PATH = exports.LOGOUT_API_PATH = exports.USER_API_PATH = exports.VERIFY_API_PATH = exports.RECOVER_API_PATH = exports.MAGIC_LINK_API_PATH = exports.SIGNUP_API_PATH = exports.TOKEN_API_PATH = exports.AUTH_API_PATH = exports.REST_API_PATH = void 0;
// REST API paths from Supabase
exports.REST_API_PATH = '/rest/v1';
exports.AUTH_API_PATH = '/auth/v1';
exports.TOKEN_API_PATH = `${exports.AUTH_API_PATH}/token`;
exports.SIGNUP_API_PATH = `${exports.AUTH_API_PATH}/signup`;
exports.MAGIC_LINK_API_PATH = `${exports.AUTH_API_PATH}/magiclink`;
exports.RECOVER_API_PATH = `${exports.AUTH_API_PATH}/recover`;
exports.VERIFY_API_PATH = `${exports.AUTH_API_PATH}/verify`;
exports.USER_API_PATH = `${exports.AUTH_API_PATH}/user`;
exports.LOGOUT_API_PATH = `${exports.AUTH_API_PATH}/logout`;
exports.INVITE_API_PATH = `${exports.AUTH_API_PATH}/invite`;
exports.RESET_API_PATH = `${exports.AUTH_API_PATH}/reset`;
// Error messages
exports.ERROR_MESSAGES = {
    INVALID_RESPONSE: 'Invalid response from server',
    REQUEST_FAILED: 'Request failed',
    INVALID_CONFIG: 'Invalid client configuration',
    NETWORK_ERROR: 'Network error occurred',
    PARSE_ERROR: 'Failed to parse response'
};
//# sourceMappingURL=index.js.map