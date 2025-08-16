"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = createSupabaseClient;
const types_1 = require("../types");
const constants_1 = require("../constants");
function createSupabaseClient(config) {
    if (!config.baseUrl || !config.apiKey) {
        throw new types_1.SupabaseError(constants_1.ERROR_MESSAGES.INVALID_CONFIG);
    }
    let baseUrl = config.baseUrl;
    let apiKey = config.apiKey;
    let token = config.token;
    // Core HTTP request method
    async function doRequest(method, endpoint, queryParams, body) {
        // Build URL
        let url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const params = new URLSearchParams(queryParams).toString();
            url += (url.includes('?') ? '&' : '?') + params;
        }
        // Prepare headers
        const headers = {
            'apikey': apiKey,
            'Authorization': `Bearer ${token || apiKey}`,
            'Content-Type': 'application/json',
        };
        // Prepare fetch options
        const options = {
            method,
            headers,
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
    async function authRequest(endpoint, payload) {
        const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}/${endpoint}`;
        const headers = {
            'apikey': apiKey,
            'Authorization': `Bearer ${token || apiKey}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new types_1.SupabaseError(`Auth request failed: ${response.status} ${text}`);
        }
        return response.json();
    }
    // Auth methods
    async function signUp(email, password) {
        const payload = { email, password };
        const path = `${constants_1.SIGNUP_API_PATH}?grant_type=signup`;
        return doRequest('POST', path, undefined, payload);
    }
    async function signIn(email, password) {
        const payload = { email, password };
        const path = `${constants_1.TOKEN_API_PATH}?grant_type=password`;
        return authRequest(path, payload);
    }
    async function refreshToken(refreshTokenValue) {
        const payload = { refresh_token: refreshTokenValue };
        const path = `${constants_1.TOKEN_API_PATH}?grant_type=refresh_token`;
        return authRequest(path, payload);
    }
    async function sendMagicLink(email) {
        const payload = { email };
        return doRequest('POST', constants_1.MAGIC_LINK_API_PATH, undefined, payload);
    }
    async function sendPasswordRecovery(email) {
        const payload = { email };
        return doRequest('POST', constants_1.RECOVER_API_PATH, undefined, payload);
    }
    async function verifyOTP(email, tokenValue, otpType) {
        const payload = { email, token: tokenValue, type: otpType };
        return doRequest('POST', constants_1.VERIFY_API_PATH, undefined, payload);
    }
    // User methods
    async function getUser() {
        return doRequest('GET', constants_1.USER_API_PATH);
    }
    async function updateUser(payload) {
        return doRequest('PUT', constants_1.USER_API_PATH, undefined, payload);
    }
    async function signOut() {
        return doRequest('POST', constants_1.LOGOUT_API_PATH);
    }
    async function inviteUser(email) {
        const payload = { email };
        return doRequest('POST', constants_1.INVITE_API_PATH, undefined, payload);
    }
    async function resetPassword(tokenValue, newPassword) {
        const payload = { token: tokenValue, password: newPassword };
        const path = `${constants_1.RESET_API_PATH}?grant_type=reset_password`;
        return doRequest('POST', path, undefined, payload);
    }
    // REST methods
    async function get(endpoint, queryParams) {
        return doRequest('GET', endpoint, queryParams);
    }
    async function post(endpoint, data) {
        return doRequest('POST', endpoint, undefined, data);
    }
    async function put(endpoint, primaryKeyName, primaryKeyValue, data) {
        const queryParams = { [primaryKeyName]: primaryKeyValue };
        return doRequest('PUT', endpoint, queryParams, data);
    }
    async function patch(endpoint, queryParams, data) {
        return doRequest('PATCH', endpoint, queryParams, data);
    }
    async function del(endpoint, primaryKeyName, primaryKeyValue) {
        const queryParams = { [primaryKeyName]: primaryKeyValue };
        return doRequest('DELETE', endpoint, queryParams);
    }
    // Return the client object with all methods
    return {
        // Properties
        baseUrl,
        apiKey,
        get token() { return token; },
        // Core methods
        setToken: (newToken) => { token = newToken; },
        getToken: () => token,
        doRequest,
        authRequest,
        // Auth methods
        signUp,
        signIn,
        refreshToken,
        sendMagicLink,
        sendPasswordRecovery,
        verifyOTP,
        // User methods
        getUser,
        updateUser,
        signOut,
        inviteUser,
        resetPassword,
        // REST methods
        get,
        post,
        put,
        patch,
        delete: del,
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
        ERROR_MESSAGES: constants_1.ERROR_MESSAGES,
    };
}
//# sourceMappingURL=SupabaseClient.js.map