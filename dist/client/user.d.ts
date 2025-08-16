import { DoRequestFn } from '../types';
/**
 * Creates user management methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @returns An object with user management methods
 */
export declare function createUserMethods(doRequest: DoRequestFn): {
    /**
     * Retrieves the current user's information.
     * @returns The user object or API response
     */
    getUser(): Promise<unknown>;
    /**
     * Updates the current user's information.
     * @param payload - Fields to update for the user
     * @returns The updated user object or API response
     */
    updateUser(payload: Record<string, unknown>): Promise<unknown>;
    /**
     * Signs out the current user.
     * @returns The API response
     */
    signOut(): Promise<unknown>;
    /**
     * Invites a new user by email.
     * @param email - Email address to invite
     * @returns The API response
     */
    inviteUser(email: string): Promise<unknown>;
    /**
     * Resets a user's password using a token.
     * @param tokenValue - The reset token
     * @param newPassword - The new password
     * @returns The API response
     */
    resetPassword(tokenValue: string, newPassword: string): Promise<unknown>;
};
//# sourceMappingURL=user.d.ts.map