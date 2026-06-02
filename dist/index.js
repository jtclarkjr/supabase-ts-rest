//#region src/types/index.ts
/**
* Custom error class for Supabase client errors
*/
var SupabaseError = class extends Error {
	statusCode;
	response;
	constructor(message, statusCode, response) {
		super(message);
		this.statusCode = statusCode;
		this.response = response;
		this.name = "SupabaseError";
	}
};
//#endregion
//#region src/utils/constants/index.ts
/**
* Constants for Supabase API paths and configuration
*/
const REST_API_PATH = "/rest/v1";
const AUTH_API_PATH = "/auth/v1";
const TOKEN_API_PATH = `${AUTH_API_PATH}/token`;
const SIGNUP_API_PATH = `${AUTH_API_PATH}/signup`;
const MAGIC_LINK_API_PATH = `${AUTH_API_PATH}/magiclink`;
const RECOVER_API_PATH = `${AUTH_API_PATH}/recover`;
const VERIFY_API_PATH = `${AUTH_API_PATH}/verify`;
const USER_API_PATH = `${AUTH_API_PATH}/user`;
const LOGOUT_API_PATH = `${AUTH_API_PATH}/logout`;
const INVITE_API_PATH = `${AUTH_API_PATH}/invite`;
const RESET_API_PATH = `${AUTH_API_PATH}/reset`;
const ERROR_MESSAGES = {
	INVALID_RESPONSE: "Invalid response from server",
	REQUEST_FAILED: "Request failed",
	INVALID_CONFIG: "Invalid client configuration",
	NETWORK_ERROR: "Network error occurred",
	PARSE_ERROR: "Failed to parse response"
};
//#endregion
//#region src/client/index.ts
/**
* Creates a new Supabase client instance with authentication, user, and REST methods.
*/
function createSupabaseClient(config) {
	if (!config.baseUrl || !config.apiKey) throw new SupabaseError(ERROR_MESSAGES.INVALID_CONFIG);
	let baseUrl = config.baseUrl.replace(/\/+$/, "");
	let apiKey = config.apiKey;
	let token = config.token;
	function parseResponseBody(text) {
		if (!text) return {};
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	function pickErrorMessage(value) {
		if (!value || typeof value !== "object") return null;
		const payload = value;
		for (const key of [
			"msg",
			"message",
			"error_description",
			"error"
		]) {
			const nextValue = payload[key];
			if (typeof nextValue === "string" && nextValue.trim()) return nextValue.trim();
		}
		return null;
	}
	function createRequestError(prefix, response, text) {
		const parsed = parseResponseBody(text);
		const message = pickErrorMessage(parsed) ?? text.trim();
		const suffix = message ? ` ${message}` : "";
		return new SupabaseError(`${prefix}: ${response.status}${suffix}`, response.status, parsed);
	}
	async function request(method, endpoint, body, queryParams) {
		const url = buildUrl(endpoint, queryParams);
		const options = {
			method,
			headers: {
				apikey: apiKey,
				Authorization: `Bearer ${token || apiKey}`,
				"Content-Type": "application/json"
			}
		};
		if (body !== void 0) options.body = JSON.stringify(body);
		const response = await fetch(url, options);
		if (!response.ok) throw createRequestError("Request failed", response, await response.text());
		return parseResponseBody(await response.text());
	}
	async function publicRequest(method, endpoint, body, queryParams) {
		const url = buildUrl(endpoint, queryParams);
		const options = {
			method,
			headers: {
				apikey: apiKey,
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			}
		};
		if (body !== void 0) options.body = JSON.stringify(body);
		const response = await fetch(url, options);
		if (!response.ok) throw createRequestError("Request failed", response, await response.text());
		return parseResponseBody(await response.text());
	}
	async function auth(endpoint, payload) {
		const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
		const headers = {
			apikey: apiKey,
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		};
		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(payload)
		});
		if (!response.ok) throw createRequestError("Auth request failed", response, await response.text());
		return response.json();
	}
	function buildUrl(endpoint, queryParams) {
		let url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
		if (queryParams) {
			const params = new URLSearchParams();
			for (const [key, value] of Object.entries(queryParams)) if (typeof value === "string") params.set(key, value);
			const query = params.toString();
			if (query) url += (url.includes("?") ? "&" : "?") + query;
		}
		return url;
	}
	return {
		baseUrl,
		apiKey,
		get token() {
			return token;
		},
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
		/** Registers a new user with email and password. */
		async signUp(email, password, options = {}) {
			const gotrueMetaSecurity = {};
			if (options.captchaToken) gotrueMetaSecurity.captcha_token = options.captchaToken;
			return publicRequest("POST", SIGNUP_API_PATH, {
				email,
				password,
				data: options.data ?? {},
				gotrue_meta_security: gotrueMetaSecurity,
				code_challenge: null,
				code_challenge_method: null
			}, options.redirectTo ? { redirect_to: options.redirectTo } : void 0);
		},
		/** Starts an anonymous authenticated session. */
		async signInAnonymously(options = {}) {
			return publicRequest("POST", SIGNUP_API_PATH, {
				data: options.data ?? {},
				gotrue_meta_security: {}
			});
		},
		/** Signs in a user with email and password. */
		async signIn(email, password) {
			const payload = {
				email,
				password
			};
			return auth(`${TOKEN_API_PATH}?grant_type=password`, payload);
		},
		/** Refreshes the authentication token. */
		async refreshToken(refreshTokenValue) {
			const payload = { refresh_token: refreshTokenValue };
			return auth(`${TOKEN_API_PATH}?grant_type=refresh_token`, payload);
		},
		/** Exchanges an OAuth authorization code for a session token pair. */
		async exchangeCodeForSession(authCode, codeVerifier) {
			const payload = {
				auth_code: authCode,
				code_verifier: codeVerifier
			};
			return auth(`${TOKEN_API_PATH}?grant_type=pkce`, payload);
		},
		/** Sends a magic link for passwordless sign-in. */
		async sendMagicLink(email) {
			return publicRequest("POST", MAGIC_LINK_API_PATH, { email });
		},
		/** Sends a password recovery email. */
		async sendPasswordRecovery(email) {
			return publicRequest("POST", RECOVER_API_PATH, { email });
		},
		/** Verifies an OTP code. */
		async verifyOTP(email, tokenValue, otpType) {
			return publicRequest("POST", VERIFY_API_PATH, {
				email,
				token: tokenValue,
				type: otpType
			});
		},
		/** Builds an OAuth authorize URL for a provider. */
		getOAuthSignInUrl(provider, options = {}) {
			return {
				provider,
				url: buildUrl(`${SIGNUP_API_PATH.replace("/signup", "/authorize")}`, {
					provider,
					redirect_to: options.redirectTo,
					scopes: options.scopes,
					...options.queryParams
				})
			};
		},
		/** Gets the current authenticated user. */
		async getUser() {
			return request("GET", USER_API_PATH);
		},
		/** Updates the current user's information. */
		async updateUser(payload) {
			return request("PUT", USER_API_PATH, payload);
		},
		/** Signs out the current user. */
		async signOut(scope = "global") {
			return request("POST", `${LOGOUT_API_PATH}?scope=${scope}`);
		},
		/** Invites a new user by email. */
		async inviteUser(email) {
			return publicRequest("POST", INVITE_API_PATH, { email });
		},
		/** Resets a user's password using a reset token. */
		async resetPassword(tokenValue, newPassword) {
			const payload = {
				token: tokenValue,
				password: newPassword
			};
			return request("POST", `${RESET_API_PATH}?grant_type=reset_password`, payload);
		},
		/** Performs a GET request to fetch data. */
		async get(endpoint, queryParams) {
			if (queryParams) return request("GET", endpoint, void 0, queryParams);
			return request("GET", endpoint);
		},
		/** Performs a POST request to create data. */
		async post(endpoint, data) {
			return request("POST", endpoint, data);
		},
		/** Performs a PUT request to replace a record. */
		async put(endpoint, primaryKeyName, primaryKeyValue, data) {
			return request("PUT", endpoint, data, { [primaryKeyName]: primaryKeyValue });
		},
		/** Performs a PATCH request to update records. */
		async patch(endpoint, queryParams, data) {
			return request("PATCH", endpoint, data, queryParams);
		},
		/** Performs a DELETE request to remove a record. */
		async del(endpoint, primaryKeyName, primaryKeyValue) {
			return request("DELETE", endpoint, { [primaryKeyName]: primaryKeyValue });
		},
		/** Alias for the REST delete method. */
		async delete(endpoint, primaryKeyName, primaryKeyValue) {
			return request("DELETE", endpoint, { [primaryKeyName]: primaryKeyValue });
		},
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
//#endregion
//#region src/utils/keys/index.ts
/**
* Detects the format of a Supabase API key by its prefix.
*
* Useful for guarding server-only code paths (never ship a `secret` key
* to the browser) or for logging and telemetry.
*
* @param apiKey - The Supabase API key to inspect.
* @returns `'publishable'`, `'secret'`, or `'legacy'`.
*
* @example
* ```typescript
* detectKeyType('sb_publishable_abc123') // 'publishable'
* detectKeyType('sb_secret_xyz789')      // 'secret'
* detectKeyType('eyJhbGciOi...')         // 'legacy'
* ```
*/
function detectKeyType(apiKey) {
	if (apiKey.startsWith("sb_publishable_")) return "publishable";
	if (apiKey.startsWith("sb_secret_")) return "secret";
	return "legacy";
}
//#endregion
//#region src/index.ts
/**
* Creates a new Supabase REST client instance with authentication support.
*
* This client provides a simplified interface for interacting with Supabase's REST API,
* including authentication, user management, and database operations with automatic
* Row Level Security (RLS) token handling.
*
* @param baseUrl - Your Supabase project URL (e.g., "https://your-project.supabase.co")
* @param apiKey - Your Supabase API key. Accepts `sb_publishable_...` (recommended for
*   browsers), `sb_secret_...` (server only), or a legacy anon/service_role key.
* @param token - Optional JWT token for authenticated requests
* @returns A SupabaseClient instance with methods for auth, user management, and REST operations
*
* @example
* ```typescript
* import { createClient } from '@jtclarkjr/supabase-ts-rest';
*
* const client = createClient(
*   'https://your-project.supabase.co',
*   'sb_publishable_your-key-here'
* );
*
* // Authenticate user
* const auth = await client.signIn('user@example.com', 'password');
* client.setToken(auth.access_token);
*
* // Perform database operations
* const users = await client.get('users');
* const newUser = await client.post('users', { name: 'John', email: 'john@example.com' });
* ```
*
* @example
* ```typescript
* // Environment-based configuration.
* // Legacy SUPABASE_ANON_KEY is still supported with no code changes.
* const client = createClient(
*   process.env.SUPABASE_URL!,
*   process.env.SUPABASE_PUBLISHABLE_KEY!
* );
*
* // Magic link authentication
* await client.sendMagicLink('user@example.com');
*
* // Get authenticated user
* const user = await client.getUser();
* console.log(user.email); // "user@example.com"
* ```
*
* @example
* ```typescript
* // Advanced usage with error handling
* try {
*   const client = createClient(baseUrl, apiKey);
*
*   // Query with filters
*   const activeUsers = await client.get('users', { status: 'active' });
*
*   // Update with conditions
*   const updated = await client.patch('users', { id: '123' }, {
*     last_seen: new Date().toISOString()
*   });
* } catch (error) {
*   if (error instanceof SupabaseError) {
*     console.error('API Error:', error.message, error.statusCode);
*   }
* }
* ```
*/
function createClient(baseUrl, apiKey, token) {
	return createSupabaseClient({
		baseUrl,
		apiKey,
		token
	});
}
//#endregion
export { AUTH_API_PATH, ERROR_MESSAGES, INVITE_API_PATH, LOGOUT_API_PATH, MAGIC_LINK_API_PATH, RECOVER_API_PATH, RESET_API_PATH, REST_API_PATH, SIGNUP_API_PATH, SupabaseError, TOKEN_API_PATH, USER_API_PATH, VERIFY_API_PATH, createClient, createSupabaseClient, detectKeyType };

//# sourceMappingURL=index.js.map