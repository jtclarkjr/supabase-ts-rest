"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMethods = createAuthMethods;
const constants_1 = require("../utils/constants");
/**
 * Creates authentication-related methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @param authRequest - Auth-specific request function
 * @returns An object with authentication methods
 */
function createAuthMethods(doRequest, authRequest) {
    return {
        /**
         * Registers a new user with email and password.
         * @param email - User's email address
         * @param password - User's password
         * @returns The API response
         */
        async signUp(email, password) {
            const payload = { email, password };
            const path = `${constants_1.SIGNUP_API_PATH}?grant_type=signup`;
            return doRequest('POST', path, payload);
        },
        /**
         * Signs in a user with email and password.
         * @param email - User's email address
         * @param password - User's password
         * @returns The authentication token response
         */
        async signIn(email, password) {
            const payload = { email, password };
            const path = `${constants_1.TOKEN_API_PATH}?grant_type=password`;
            return authRequest(path, payload);
        },
        /**
         * Refreshes the authentication token using a refresh token.
         * @param refreshTokenValue - The refresh token
         * @returns The authentication token response
         */
        async refreshToken(refreshTokenValue) {
            const payload = { refresh_token: refreshTokenValue };
            const path = `${constants_1.TOKEN_API_PATH}?grant_type=refresh_token`;
            return authRequest(path, payload);
        },
        /**
         * Sends a magic link to the user's email for passwordless sign-in.
         * @param email - User's email address
         * @returns The API response
         */
        async sendMagicLink(email) {
            const payload = { email };
            return doRequest('POST', constants_1.MAGIC_LINK_API_PATH, payload);
        },
        /**
         * Sends a password recovery email to the user.
         * @param email - User's email address
         * @returns The API response
         */
        async sendPasswordRecovery(email) {
            const payload = { email };
            return doRequest('POST', constants_1.RECOVER_API_PATH, payload);
        },
        /**
         * Verifies a one-time password (OTP) for email or phone.
         * @param email - User's email address
         * @param tokenValue - The OTP token
         * @param otpType - The type of OTP (e.g., 'email', 'sms')
         * @returns The API response
         */
        async verifyOTP(email, tokenValue, otpType) {
            const payload = {
                email,
                token: tokenValue,
                type: otpType
            };
            return doRequest('POST', constants_1.VERIFY_API_PATH, payload);
        }
    };
}
//# sourceMappingURL=auth.js.map