import { DoRequestFn } from '../types';
import { USER_API_PATH, LOGOUT_API_PATH, INVITE_API_PATH, RESET_API_PATH } from '../utils/constants';

/**
 * Creates user management methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @returns An object with user management methods
 */
export function createUserMethods(doRequest: DoRequestFn) {
  return {
  /**
   * Retrieves the current user's information.
   * @returns The user object or API response
   */
  async getUser(): Promise<unknown> {
      return doRequest('GET', USER_API_PATH);
    },

  /**
   * Updates the current user's information.
   * @param payload - Fields to update for the user
   * @returns The updated user object or API response
   */
  async updateUser(payload: Record<string, unknown>): Promise<unknown> {
      return doRequest('PUT', USER_API_PATH, undefined, payload);
    },

  /**
   * Signs out the current user.
   * @returns The API response
   */
  async signOut(): Promise<unknown> {
      return doRequest('POST', LOGOUT_API_PATH);
    },

  /**
   * Invites a new user by email.
   * @param email - Email address to invite
   * @returns The API response
   */
  async inviteUser(email: string): Promise<unknown> {
      const payload = { email };
      return doRequest('POST', INVITE_API_PATH, undefined, payload);
    },

  /**
   * Resets a user's password using a token.
   * @param tokenValue - The reset token
   * @param newPassword - The new password
   * @returns The API response
   */
  async resetPassword(tokenValue: string, newPassword: string): Promise<unknown> {
      const payload = { token: tokenValue, password: newPassword };
      const path = `${RESET_API_PATH}?grant_type=reset_password`;
      return doRequest('POST', path, undefined, payload);
    }
  };
}
