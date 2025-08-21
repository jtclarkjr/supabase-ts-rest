import { DoRequestFn } from '../types'
import {
  USER_API_PATH,
  LOGOUT_API_PATH,
  INVITE_API_PATH,
  RESET_API_PATH
} from '../utils/constants'

/**
 * Creates user management methods for the Supabase client.
 * @param doRequest - Core HTTP request function
 * @returns An object with user management methods
 */
export function createUserMethods(doRequest: DoRequestFn) {
  return {
    /**
     * Retrieves the current authenticated user's information.
     * 
     * Fetches the profile and metadata of the currently authenticated user.
     * Requires a valid authentication token to be set on the client.
     * 
     * @returns Promise resolving to the user object with profile information
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // First authenticate
     * const auth = await client.signIn('user@example.com', 'password');
     * client.setToken(auth.access_token);
     * 
     * // Get user information
     * const user = await client.getUser();
     * console.log('Current user:', user.email);
     * console.log('User ID:', user.id);
     * ```
     * 
     * @example
     * ```typescript
     * // Check if user is authenticated
     * try {
     *   const user = await client.getUser();
     *   console.log(`Welcome back, ${user.email}!`);
     *   return user;
     * } catch (error) {
     *   console.log('User not authenticated');
     *   // Redirect to login
     *   return null;
     * }
     * ```
     */
    async getUser(): Promise<unknown> {
      return doRequest('GET', USER_API_PATH)
    },

    /**
     * Updates the current authenticated user's information.
     * 
     * Modifies profile fields for the currently authenticated user.
     * Only the fields provided in the payload will be updated.
     * 
     * @param payload - Object containing the fields to update
     * @returns Promise resolving to the updated user object
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Authenticate first
     * const auth = await client.signIn('user@example.com', 'password');
     * client.setToken(auth.access_token);
     * 
     * // Update user profile
     * const updatedUser = await client.updateUser({
     *   email: 'newemail@example.com',
     *   password: 'newpassword123'
     * });
     * console.log('Profile updated:', updatedUser);
     * ```
     * 
     * @example
     * ```typescript
     * // Update user metadata
     * const userUpdate = await client.updateUser({
     *   user_metadata: {
     *     first_name: 'John',
     *     last_name: 'Doe',
     *     avatar_url: 'https://example.com/avatar.jpg'
     *   }
     * });
     * console.log('Metadata updated:', userUpdate.user_metadata);
     * ```
     * 
     * @example
     * ```typescript
     * // Change password only
     * try {
     *   await client.updateUser({ password: 'newSecurePassword123' });
     *   console.log('Password updated successfully');
     * } catch (error) {
     *   console.error('Password update failed:', error.message);
     * }
     * ```
     */
    async updateUser(payload: Record<string, unknown>): Promise<unknown> {
      return doRequest('PUT', USER_API_PATH, payload)
    },

    /**
     * Signs out the current authenticated user.
     * 
     * Invalidates the current session and logs out the user.
     * After calling this method, the authentication token becomes invalid.
     * 
     * @returns Promise resolving to the signout response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Sign out current user
     * await client.signOut();
     * console.log('User signed out successfully');
     * 
     * // Clear the token from client
     * client.setToken('');
     * ```
     * 
     * @example
     * ```typescript
     * // Sign out with cleanup
     * async function logout() {
     *   try {
     *     await client.signOut();
     *     
     *     // Clear local storage
     *     localStorage.removeItem('user_token');
     *     localStorage.removeItem('user_data');
     *     
     *     // Redirect to login page
     *     window.location.href = '/login';
     *   } catch (error) {
     *     console.error('Logout failed:', error.message);
     *   }
     * }
     * ```
     */
    async signOut(): Promise<unknown> {
      return doRequest('POST', LOGOUT_API_PATH)
    },

    /**
     * Invites a new user by sending them an invitation email.
     * 
     * Sends an invitation email to the specified address. The recipient
     * can use the invitation to create an account. Requires admin privileges.
     * 
     * @param email - Email address of the person to invite
     * @returns Promise resolving to the invitation response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Admin user invites new team member
     * client.setToken(adminToken);
     * 
     * const invitation = await client.inviteUser('newmember@company.com');
     * console.log('Invitation sent:', invitation);
     * ```
     * 
     * @example
     * ```typescript
     * // Bulk invite multiple users
     * const emailList = [
     *   'developer1@company.com',
     *   'developer2@company.com',
     *   'designer@company.com'
     * ];
     * 
     * for (const email of emailList) {
     *   try {
     *     await client.inviteUser(email);
     *     console.log(`Invitation sent to ${email}`);
     *   } catch (error) {
     *     console.error(`Failed to invite ${email}:`, error.message);
     *   }
     * }
     * ```
     */
    async inviteUser(email: string): Promise<unknown> {
      const payload = { email }
      return doRequest('POST', INVITE_API_PATH, payload)
    },

    /**
     * Resets a user's password using a valid reset token.
     * 
     * Completes the password reset process by providing a reset token
     * (obtained from a password recovery email) and the new password.
     * 
     * @param tokenValue - The reset token from the recovery email
     * @param newPassword - The new password to set for the user
     * @returns Promise resolving to the password reset response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // User clicks reset link and provides new password
     * const resetToken = 'token-from-email-link';
     * const newPassword = 'myNewSecurePassword123';
     * 
     * const result = await client.resetPassword(resetToken, newPassword);
     * console.log('Password reset successful:', result);
     * ```
     * 
     * @example
     * ```typescript
     * // Reset password with validation
     * const token = getTokenFromURL(); // Extract from URL params
     * const password = document.getElementById('new-password').value;
     * 
     * if (password.length >= 8) {
     *   try {
     *     await client.resetPassword(token, password);
     *     alert('Password reset successfully! You can now sign in.');
     *     window.location.href = '/login';
     *   } catch (error) {
     *     alert('Reset failed: ' + error.message);
     *   }
     * } else {
     *   alert('Password must be at least 8 characters long');
     * }
     * ```
     */
    async resetPassword(
      tokenValue: string,
      newPassword: string
    ): Promise<unknown> {
      const payload = { token: tokenValue, password: newPassword }
      const path = `${RESET_API_PATH}?grant_type=reset_password`
      return doRequest('POST', path, payload)
    }
  }
}
