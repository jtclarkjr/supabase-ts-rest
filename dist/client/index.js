"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = createSupabaseClient;
const types_1 = require("../types");
const constants_1 = require("../utils/constants");
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 */
function createSupabaseClient(config) {
    if (!config.baseUrl || !config.apiKey) {
        throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.INVALID_CONFIG);
    }
    let baseUrl = config.baseUrl;
    let apiKey = config.apiKey;
    let token = config.token;
    // Core HTTP request method
    async function request(method, endpoint, body, queryParams) {
        // Build URL
        let url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const params = new URLSearchParams(queryParams).toString();
            url += (url.includes('?') ? '&' : '?') + params;
        }
        // Prepare headers
        const headers = {
            apikey: apiKey,
            Authorization: `Bearer ${token || apiKey}`,
            'Content-Type': 'application/json'
        };
        // Prepare fetch options
        const options = {
            method,
            headers
        };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }
        // Make request
        const response = await fetch(url, options);
        if (!response.ok) {
            const text = await response.text();
            throw new types_1.SupabaseError(`Request failed: ${response.status} ${text}`);
        }
        const text = await response.text();
        try {
            return text ? JSON.parse(text) : {};
        }
        catch {
            return text;
        }
    }
    // Auth request method
    async function auth(endpoint, payload) {
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${baseUrl}/${endpoint}`;
        const headers = {
            apikey: apiKey,
            Authorization: `Bearer ${token || apiKey}`,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const text = await response.text();
            throw new types_1.SupabaseError(`Auth request failed: ${response.status} ${text}`);
        }
        return response.json();
    }
    // Return the client object with all methods defined directly
    return {
        // Properties
        baseUrl,
        apiKey,
        get token() {
            return token;
        },
        // Core methods
        /** Sets the authentication token. */
        setToken: (newToken) => {
            token = newToken;
        },
        /** Gets the current authentication token. */
        getToken: () => token,
        /** Core HTTP request method. */
        request,
        /** Auth request method. */
        auth,
        // Auth methods
        /** Registers a new user with email and password. */
        async signUp(email, password) {
            const payload = { email, password };
            const path = `${constants_1.SIGNUP_API_PATH}?grant_type=signup`;
            return request('POST', path, payload);
        },
        /** Signs in a user with email and password. */
        async signIn(email, password) {
            const payload = { email, password };
            const path = `${constants_1.TOKEN_API_PATH}?grant_type=password`;
            return auth(path, payload);
        },
        /** Refreshes the authentication token. */
        async refreshToken(refreshTokenValue) {
            const payload = { refresh_token: refreshTokenValue };
            const path = `${constants_1.TOKEN_API_PATH}?grant_type=refresh_token`;
            return auth(path, payload);
        },
        /** Sends a magic link for passwordless sign-in. */
        async sendMagicLink(email) {
            const payload = { email };
            return request('POST', constants_1.MAGIC_LINK_API_PATH, payload);
        },
        /** Sends a password recovery email. */
        async sendPasswordRecovery(email) {
            const payload = { email };
            return request('POST', constants_1.RECOVER_API_PATH, payload);
        },
        /** Verifies an OTP code. */
        async verifyOTP(email, tokenValue, otpType) {
            const payload = {
                email,
                token: tokenValue,
                type: otpType
            };
            return request('POST', constants_1.VERIFY_API_PATH, payload);
        },
        // User methods
        /** Gets the current authenticated user. */
        async getUser() {
            return request('GET', constants_1.USER_API_PATH);
        },
        /** Updates the current user's information. */
        async updateUser(payload) {
            return request('PUT', constants_1.USER_API_PATH, payload);
        },
        /** Signs out the current user. */
        async signOut() {
            return request('POST', constants_1.LOGOUT_API_PATH);
        },
        /** Invites a new user by email. */
        async inviteUser(email) {
            const payload = { email };
            return request('POST', constants_1.INVITE_API_PATH, payload);
        },
        /** Resets a user's password using a reset token. */
        async resetPassword(tokenValue, newPassword) {
            const payload = { token: tokenValue, password: newPassword };
            const path = `${constants_1.RESET_API_PATH}?grant_type=reset_password`;
            return request('POST', path, payload);
        },
        // REST methods
        /** Performs a GET request to fetch data. */
        async get(endpoint, queryParams) {
            if (queryParams) {
                return request('GET', endpoint, undefined, queryParams);
            }
            return request('GET', endpoint);
        },
        /** Performs a POST request to create data. */
        async post(endpoint, data) {
            return request('POST', endpoint, data);
        },
        /** Performs a PUT request to replace a record. */
        async put(endpoint, primaryKeyName, primaryKeyValue, data) {
            const queryParams = { [primaryKeyName]: primaryKeyValue };
            return request('PUT', endpoint, data, queryParams);
        },
        /** Performs a PATCH request to update records. */
        async patch(endpoint, queryParams, data) {
            return request('PATCH', endpoint, data, queryParams);
        },
        /** Performs a DELETE request to remove a record. */
        async del(endpoint, primaryKeyName, primaryKeyValue) {
            const queryParams = { [primaryKeyName]: primaryKeyValue };
            return request('DELETE', endpoint, queryParams);
        },
        /** Alias for the REST delete method. */
        get delete() {
            return this.del;
        },
        // Constants for compatibility
        TOKEN_API_PATH: constants_1.TOKEN_API_PATH,
        SIGNUP_API_PATH: constants_1.SIGNUP_API_PATH,
        MAGIC_LINK_API_PATH: constants_1.MAGIC_LINK_API_PATH,
        RECOVER_API_PATH: constants_1.RECOVER_API_PATH,
        VERIFY_API_PATH: constants_1.VERIFY_API_PATH,
        USER_API_PATH: constants_1.USER_API_PATH,
        LOGOUT_API_PATH: constants_1.LOGOUT_API_PATH,
        INVITE_API_PATH: constants_1.INVITE_API_PATH,
        RESET_API_PATH: constants_1.RESET_API_PATH,
        ERROR_MESSAGES: constants_1.ERROR_MESSAGES
    };
}
//# sourceMappingURL=index.js.map