"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseClient = void 0;
const types_1 = require("./types");
const constants_1 = require("./constants");
/**
 * Supabase REST client for TypeScript/Node.js
 */
class SupabaseClient {
    /**
     * Creates a new Supabase client instance
     */
    constructor(config) {
        if (!config.baseUrl || !config.apiKey) {
            throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.INVALID_CONFIG);
        }
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.token = config.token;
    }
    /**
     * Updates the authentication token
     */
    setToken(token) {
        this.token = token;
    }
    /**
     * Gets the current authentication token
     */
    getToken() {
        return this.token;
    }
    // ==================
    // AUTH METHODS
    // ==================
    /**
     * Creates a new user account
     */
    async signUp(email, password) {
        const payload = { email, password };
        const path = `${constants_1.SIGNUP_API_PATH}?grant_type=signup`;
        return this.doRequest('POST', path, undefined, payload);
    }
    /**
     * Authenticates a user and retrieves a token
     */
    async signIn(email, password) {
        const payload = {
            email,
            password,
        };
        const path = `${constants_1.TOKEN_API_PATH}?grant_type=password`;
        return this.authRequest(path, payload);
    }
    /**
     * Refreshes the access token using a refresh token
     */
    async refreshToken(refreshToken) {
        const payload = {
            refresh_token: refreshToken,
        };
        const path = `${constants_1.TOKEN_API_PATH}?grant_type=refresh_token`;
        return this.authRequest(path, payload);
    }
    /**
     * Sends a magic link to the user's email
     */
    async sendMagicLink(email) {
        const payload = { email };
        return this.doRequest('POST', constants_1.MAGIC_LINK_API_PATH, undefined, payload);
    }
    /**
     * Sends a password recovery email
     */
    async sendPasswordRecovery(email) {
        const payload = { email };
        return this.doRequest('POST', constants_1.RECOVER_API_PATH, undefined, payload);
    }
    /**
     * Verifies a one-time password (OTP)
     */
    async verifyOTP(email, token, otpType) {
        const payload = {
            email,
            token,
            type: otpType,
        };
        return this.doRequest('POST', constants_1.VERIFY_API_PATH, undefined, payload);
    }
    /**
     * Retrieves the authenticated user's information
     */
    async getUser() {
        return this.doRequest('GET', constants_1.USER_API_PATH);
    }
    /**
     * Updates the authenticated user's information
     */
    async updateUser(payload) {
        return this.doRequest('PUT', constants_1.USER_API_PATH, undefined, payload);
    }
    /**
     * Signs out the current user
     */
    async signOut() {
        return this.doRequest('POST', constants_1.LOGOUT_API_PATH);
    }
    /**
     * Invites a new user (admin only)
     */
    async inviteUser(email) {
        const payload = { email };
        return this.doRequest('POST', constants_1.INVITE_API_PATH, undefined, payload);
    }
    /**
     * Resets a user's password using a token
     */
    async resetPassword(token, newPassword) {
        const payload = {
            token,
            password: newPassword,
        };
        const path = `${constants_1.RESET_API_PATH}?grant_type=reset_password`;
        return this.doRequest('POST', path, undefined, payload);
    }
    // ==================
    // HTTP METHODS
    // ==================
    /**
     * Performs a GET request to the Supabase REST API
     */
    async get(endpoint, queryParams) {
        return this.doRequest('GET', endpoint, queryParams);
    }
    /**
     * Performs a POST request to the Supabase REST API
     */
    async post(endpoint, data) {
        return this.doRequest('POST', endpoint, undefined, data);
    }
    /**
     * Performs a PUT request to the Supabase REST API
     */
    async put(endpoint, primaryKeyName, primaryKeyValue, data) {
        const queryParams = {
            [primaryKeyName]: primaryKeyValue,
        };
        return this.doRequest('PUT', endpoint, queryParams, data);
    }
    /**
     * Performs a PATCH request to the Supabase REST API
     */
    async patch(endpoint, queryParams, data) {
        return this.doRequest('PATCH', endpoint, queryParams, data);
    }
    /**
     * Performs a DELETE request to the Supabase REST API
     */
    async delete(endpoint, primaryKeyName, primaryKeyValue) {
        const queryParams = {
            [primaryKeyName]: primaryKeyValue,
        };
        return this.doRequest('DELETE', endpoint, queryParams);
    }
    // ==================
    // PRIVATE METHODS
    // ==================
    /**
     * Formats query parameters for Supabase compatibility
     */
    formatQueryParams(params) {
        const formattedParams = {};
        for (const [key, value] of Object.entries(params)) {
            formattedParams[key] = `eq.${encodeURIComponent(value)}`;
        }
        return formattedParams;
    }
    /**
     * Handles authentication-related requests
     */
    async authRequest(endpoint, payload) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.REQUEST_FAILED, response.status, errorText);
        }
        try {
            const authResponse = await response.json();
            return authResponse;
        }
        catch (_error) {
            throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.PARSE_ERROR);
        }
    }
    /**
     * Performs the actual HTTP request
     */
    async doRequest(method, endpoint, queryParams, body) {
        // Normalize endpoint to avoid double slashes
        const cleanEndpoint = endpoint.replace(/^\//, '');
        let url = `${this.baseUrl}${constants_1.REST_API_PATH}/${cleanEndpoint}`;
        // Add query parameters if provided
        if (queryParams && Object.keys(queryParams).length > 0) {
            const urlObj = new URL(url);
            const formattedParams = this.formatQueryParams(queryParams);
            for (const [key, value] of Object.entries(formattedParams)) {
                urlObj.searchParams.append(key, value);
            }
            url = urlObj.toString();
        }
        // Prepare headers
        const headers = {
            'apikey': this.apiKey,
            'Content-Type': 'application/json',
        };
        // Add authorization header if token is available
        if (this.token) {
            const authHeader = this.token.startsWith('Bearer ')
                ? this.token
                : `Bearer ${this.token}`;
            headers['Authorization'] = authHeader;
        }
        // Prepare request options
        const requestOptions = {
            method,
            headers,
        };
        // Add body for requests that support it
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestOptions.body = JSON.stringify(body);
        }
        try {
            const response = await fetch(url, requestOptions);
            // Handle non-successful responses
            if (!response.ok) {
                const errorText = await response.text();
                throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.REQUEST_FAILED, response.status, errorText);
            }
            // Parse and return response
            const responseText = await response.text();
            // Return empty object for empty responses
            if (!responseText) {
                return {};
            }
            try {
                return JSON.parse(responseText);
            }
            catch (_parseError) {
                // Return raw text if JSON parsing fails
                return responseText;
            }
        }
        catch (error) {
            if (error instanceof types_1.SupabaseError) {
                throw error;
            }
            throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.NETWORK_ERROR, undefined, error);
        }
    }
}
exports.SupabaseClient = SupabaseClient;
//# sourceMappingURL=client.js.map