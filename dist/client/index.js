import { SupabaseError } from '../types/index.js';
import { TOKEN_API_PATH, SIGNUP_API_PATH, MAGIC_LINK_API_PATH, RECOVER_API_PATH, VERIFY_API_PATH, USER_API_PATH, LOGOUT_API_PATH, INVITE_API_PATH, RESET_API_PATH, ERROR_MESSAGES } from '../utils/constants/index.js';
/**
 * Creates a new Supabase client instance with authentication, user, and REST methods.
 */
export function createSupabaseClient(config) {
    if (!config.baseUrl || !config.apiKey) {
        throw new SupabaseError(ERROR_MESSAGES.INVALID_CONFIG);
    }
    let baseUrl = config.baseUrl.replace(/\/+$/, '');
    let apiKey = config.apiKey;
    let token = config.token;
    function parseResponseBody(text) {
        if (!text) {
            return {};
        }
        try {
            return JSON.parse(text);
        }
        catch {
            return text;
        }
    }
    function pickErrorMessage(value) {
        if (!value || typeof value !== 'object') {
            return null;
        }
        const payload = value;
        const keys = ['msg', 'message', 'error_description', 'error'];
        for (const key of keys) {
            const nextValue = payload[key];
            if (typeof nextValue === 'string' && nextValue.trim()) {
                return nextValue.trim();
            }
        }
        return null;
    }
    function createRequestError(prefix, response, text) {
        const parsed = parseResponseBody(text);
        const message = pickErrorMessage(parsed) ?? text.trim();
        const suffix = message ? ` ${message}` : '';
        return new SupabaseError(`${prefix}: ${response.status}${suffix}`, response.status, parsed);
    }
    // Core HTTP request method
    async function request(method, endpoint, body, queryParams) {
        const url = buildUrl(endpoint, queryParams);
        const headers = {
            apikey: apiKey,
            Authorization: `Bearer ${token || apiKey}`,
            'Content-Type': 'application/json'
        };
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
            throw createRequestError('Request failed', response, text);
        }
        const text = await response.text();
        return parseResponseBody(text);
    }
    async function publicRequest(method, endpoint, body, queryParams) {
        const url = buildUrl(endpoint, queryParams);
        const headers = {
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
        const options = {
            method,
            headers
        };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            const text = await response.text();
            throw createRequestError('Request failed', response, text);
        }
        const text = await response.text();
        return parseResponseBody(text);
    }
    // Auth request method
    async function auth(endpoint, payload) {
        const url = endpoint.startsWith('http')
            ? endpoint
            : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const headers = {
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const text = await response.text();
            throw createRequestError('Auth request failed', response, text);
        }
        return response.json();
    }
    function buildUrl(endpoint, queryParams) {
        let url = endpoint.startsWith('http')
            ? endpoint
            : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        if (queryParams) {
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(queryParams)) {
                if (typeof value === 'string') {
                    params.set(key, value);
                }
            }
            const query = params.toString();
            if (query) {
                url += (url.includes('?') ? '&' : '?') + query;
            }
        }
        return url;
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
        async signUp(email, password, options = {}) {
            const gotrueMetaSecurity = {};
            if (options.captchaToken) {
                gotrueMetaSecurity.captcha_token = options.captchaToken;
            }
            const payload = {
                email,
                password,
                data: options.data ?? {},
                gotrue_meta_security: gotrueMetaSecurity,
                code_challenge: null,
                code_challenge_method: null
            };
            const queryParams = options.redirectTo
                ? { redirect_to: options.redirectTo }
                : undefined;
            return publicRequest('POST', SIGNUP_API_PATH, payload, queryParams);
        },
        /** Starts an anonymous authenticated session. */
        async signInAnonymously(options = {}) {
            const payload = {
                data: options.data ?? {},
                gotrue_meta_security: {}
            };
            return publicRequest('POST', SIGNUP_API_PATH, payload);
        },
        /** Signs in a user with email and password. */
        async signIn(email, password) {
            const payload = { email, password };
            const path = `${TOKEN_API_PATH}?grant_type=password`;
            return auth(path, payload);
        },
        /** Refreshes the authentication token. */
        async refreshToken(refreshTokenValue) {
            const payload = { refresh_token: refreshTokenValue };
            const path = `${TOKEN_API_PATH}?grant_type=refresh_token`;
            return auth(path, payload);
        },
        /** Exchanges an OAuth authorization code for a session token pair. */
        async exchangeCodeForSession(authCode, codeVerifier) {
            const payload = {
                auth_code: authCode,
                code_verifier: codeVerifier
            };
            const path = `${TOKEN_API_PATH}?grant_type=pkce`;
            return auth(path, payload);
        },
        /** Sends a magic link for passwordless sign-in. */
        async sendMagicLink(email) {
            const payload = { email };
            return publicRequest('POST', MAGIC_LINK_API_PATH, payload);
        },
        /** Sends a password recovery email. */
        async sendPasswordRecovery(email) {
            const payload = { email };
            return publicRequest('POST', RECOVER_API_PATH, payload);
        },
        /** Verifies an OTP code. */
        async verifyOTP(email, tokenValue, otpType) {
            const payload = {
                email,
                token: tokenValue,
                type: otpType
            };
            return publicRequest('POST', VERIFY_API_PATH, payload);
        },
        /** Builds an OAuth authorize URL for a provider. */
        getOAuthSignInUrl(provider, options = {}) {
            const url = buildUrl(`${SIGNUP_API_PATH.replace('/signup', '/authorize')}`, {
                provider,
                redirect_to: options.redirectTo,
                scopes: options.scopes,
                ...options.queryParams
            });
            return {
                provider,
                url
            };
        },
        // User methods
        /** Gets the current authenticated user. */
        async getUser() {
            return request('GET', USER_API_PATH);
        },
        /** Updates the current user's information. */
        async updateUser(payload) {
            return request('PUT', USER_API_PATH, payload);
        },
        /** Signs out the current user. */
        async signOut(scope = 'global') {
            return request('POST', `${LOGOUT_API_PATH}?scope=${scope}`);
        },
        /** Invites a new user by email. */
        async inviteUser(email) {
            const payload = { email };
            return publicRequest('POST', INVITE_API_PATH, payload);
        },
        /** Resets a user's password using a reset token. */
        async resetPassword(tokenValue, newPassword) {
            const payload = { token: tokenValue, password: newPassword };
            const path = `${RESET_API_PATH}?grant_type=reset_password`;
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
        TOKEN_API_PATH,
        SIGNUP_API_PATH,
        MAGIC_LINK_API_PATH,
        RECOVER_API_PATH,
        VERIFY_API_PATH,
        USER_API_PATH,
        LOGOUT_API_PATH,
        INVITE_API_PATH,
        RESET_API_PATH,
        ERROR_MESSAGES
    };
}
//# sourceMappingURL=index.js.map