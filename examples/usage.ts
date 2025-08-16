/**
 * Example usage of the Supabase REST Client
 */

import { createClient, SupabaseError } from '../src/index';

// Configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

async function main() {
  // Create client
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Example 1: Sign up a new user
    console.log('1. Signing up a new user...');
    const signUpResult = await client.signUp('test@example.com', 'password123');
    console.log('Sign up result:', signUpResult);

    // Example 2: Sign in user
    console.log('2. Signing in user...');
    const authResponse = await client.signIn('test@example.com', 'password123');
    console.log('Access token:', authResponse.access_token);

    // Set the token for authenticated requests
    client.setToken(authResponse.access_token);

    // Example 3: Get authenticated user info
    console.log('3. Getting user info...');
    const user = await client.getUser();
    console.log('User info:', user);

    // Example 4: Perform database operations
    console.log('4. Database operations...');

    // GET request
    const users = await client.get('users');
    console.log('All users:', users);

    // GET with filters
    const activeUsers = await client.get('users', { status: 'active' });
    console.log('Active users:', activeUsers);

    // POST request
    const newUser = await client.post('users', {
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active'
    });
    console.log('Created user:', newUser);

    // PUT request
    const updatedUser = await client.put('users', 'id', '1', {
      name: 'Jane Doe',
      email: 'jane@example.com'
    });
    console.log('Updated user:', updatedUser);

    // PATCH request
    const patchedUser = await client.patch('users', { id: '1' }, {
      status: 'inactive'
    });
    console.log('Patched user:', patchedUser);

    // DELETE request
    await client.delete('users', 'id', '1');
    console.log('User deleted');

    // Example 5: Magic Link
    console.log('5. Sending magic link...');
    const magicLinkResult = await client.sendMagicLink('test@example.com');
    console.log('Magic link result:', magicLinkResult);

    // Example 6: Password recovery
    console.log('6. Sending password recovery...');
    const recoveryResult = await client.sendPasswordRecovery('test@example.com');
    console.log('Recovery result:', recoveryResult);

    // Example 7: Token refresh
    console.log('7. Refreshing token...');
    const refreshedAuth = await client.refreshToken(authResponse.refresh_token);
    console.log('Refreshed token:', refreshedAuth.access_token);

    // Example 8: Update user
    console.log('8. Updating user...');
    const userUpdate = await client.updateUser({
      email: 'newemail@example.com'
    });
    console.log('Updated user:', userUpdate);

    // Example 9: Sign out
    console.log('9. Signing out...');
    await client.signOut();
    console.log('Signed out successfully');

  } catch (error) {
    if (error instanceof SupabaseError) {
      console.error('Supabase Error:', error.message);
      console.error('Status Code:', error.statusCode);
      console.error('Response:', error.response);
    } else {
      console.error('Unknown Error:', error);
    }
  }
}

// Example with environment variables
function createClientFromEnv() {
  const client = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  );
  
  // Optionally set a token from environment
  if (process.env.SUPABASE_TOKEN) {
    client.setToken(process.env.SUPABASE_TOKEN);
  }
  
  return client;
}

// Example error handling wrapper
async function safeRequest<T>(operation: () => Promise<T>): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof SupabaseError) {
      console.error(`Supabase Error [${error.statusCode}]:`, error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
}

// Example usage with error handling wrapper
async function exampleWithSafeRequests() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  const users = await safeRequest(() => client.get('users'));
  if (users) {
    console.log('Users retrieved:', users);
  }
  
  const authResult = await safeRequest(() => 
    client.signIn('test@example.com', 'password123')
  );
  if (authResult) {
    // Type assertion to inform TypeScript about the expected shape
    client.setToken((authResult as { access_token: string }).access_token);
    console.log('Authentication successful');
  }
}

// Export examples for use in other files
export {
  main,
  createClientFromEnv,
  safeRequest,
  exampleWithSafeRequests
};

// Run main example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
