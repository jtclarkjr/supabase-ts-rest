"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserMethods = createUserMethods;
const constants_1 = require("../utils/constants");
/**
 * Creates user management methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @returns An object with user management methods
 */
function createUserMethods(doRequest) {
    return {
        /**
         * Retrieves the current user's information.
         * @returns The user object or API response
         */
        async getUser() {
            return doRequest('GET', constants_1.USER_API_PATH);
        },
        /**
         * Updates the current user's information.
         * @param payload - Fields to update for the user
         * @returns The updated user object or API response
         */
        async updateUser(payload) {
            return doRequest('PUT', constants_1.USER_API_PATH, payload);
        },
        /**
         * Signs out the current user.
         * @returns The API response
         */
        async signOut() {
            return doRequest('POST', constants_1.LOGOUT_API_PATH);
        },
        /**
         * Invites a new user by email.
         * @param email - Email address to invite
         * @returns The API response
         */
        async inviteUser(email) {
            const payload = { email };
            return doRequest('POST', constants_1.INVITE_API_PATH, payload);
        },
        /**
         * Resets a user's password using a token.
         * @param tokenValue - The reset token
         * @param newPassword - The new password
         * @returns The API response
         */
        async resetPassword(tokenValue, newPassword) {
            const payload = { token: tokenValue, password: newPassword };
            const path = `${constants_1.RESET_API_PATH}?grant_type=reset_password`;
            return doRequest('POST', path, payload);
        }
    };
}
//# sourceMappingURL=user.js.map