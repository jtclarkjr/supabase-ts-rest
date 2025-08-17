/**
 * Constants for Supabase API paths and configuration
 */

// REST API paths from Supabase
export const REST_API_PATH = '/rest/v1'
export const AUTH_API_PATH = '/auth/v1'
export const TOKEN_API_PATH = `${AUTH_API_PATH}/token`
export const SIGNUP_API_PATH = `${AUTH_API_PATH}/signup`
export const MAGIC_LINK_API_PATH = `${AUTH_API_PATH}/magiclink`
export const RECOVER_API_PATH = `${AUTH_API_PATH}/recover`
export const VERIFY_API_PATH = `${AUTH_API_PATH}/verify`
export const USER_API_PATH = `${AUTH_API_PATH}/user`
export const LOGOUT_API_PATH = `${AUTH_API_PATH}/logout`
export const INVITE_API_PATH = `${AUTH_API_PATH}/invite`
export const RESET_API_PATH = `${AUTH_API_PATH}/reset`

// Error messages
export const ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid response from server',
  REQUEST_FAILED: 'Request failed',
  INVALID_CONFIG: 'Invalid client configuration',
  NETWORK_ERROR: 'Network error occurred',
  PARSE_ERROR: 'Failed to parse response'
} as const
